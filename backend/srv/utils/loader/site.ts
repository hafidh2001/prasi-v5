import { $ } from "bun";
import { watch } from "fs";
import { dirAsync, existsAsync, moveAsync, removeAsync } from "fs-jetpack";
import { appendFile } from "node:fs/promises";
import { buildFrontend } from "../build/frontend";
import { dir } from "../dir";
import { ensureFiles } from "../editor/ensure-files";
import { formatMessagesSync } from "esbuild";
import { staticFile } from "../static";
import { c } from "../color";
import { buildFrontendTypings } from "../build/frontend-typings";
import type { PrasiSite } from "../global";

export const rebuildSite = async (
  site_id: string,
  opt?: { force_reload?: boolean }
) => {
  if (g.site[site_id]) {
    if (opt?.force_reload) {
      delete g.site[site_id];
    } else {
      return;
    }
  }

  g.site[site_id] ??= {
    id: site_id,
    status: "init",
    building: false,
    promises: [],
    watcher: {},
    config: null as any,
    change_timeout: null,
  };

  const site = g.site[site_id];
  if (site.watcher) {
    for (const [k, watcher] of Object.entries(site.watcher)) {
      watcher.removeAllListeners().close();
      delete site.watcher[k];
    }
  }

  if (!site.config) {
    const s = await _db.site.findFirst({
      where: { id: site_id },
      select: { config: true },
    });
    if (s) {
      site.config = s.config as any;
    }
  }

  if (site.status === "init") {
    const output_exists = await Bun.file(
      dir.data(`/code/${site_id}/site/build/output/index.js`)
    ).exists();

    if (output_exists) {
      site.asset = await staticFile(
        dir.data(`/code/${site_id}/site/build/output`),
        {
          index: false,
        }
      );
      site.status = "ready";
    } else {
      site.status = "loading";
    }

    if (!site.building) {
      site.building = true;
      await executeRebuildSite(site);
      site.building = false;
      site.status = "ready";
    }
  }

  return site;
};

export const siteLoaded = (site_id: string) => {
  if (!g.site[site_id]) return false;
  return g.site[site_id].status === "ready";
};

export const siteLoading = (site_id: string) => {
  if (!g.site[site_id]) return false;
  if (g.site[site_id].status !== "ready") return true;
  return false;
};

const executeRebuildSite = async (site: PrasiSite) => {
  const path = `/code/${site.id}/site/src`;
  const logPath = dir.data(`${path}/log/frontend.log`);
  await dirAsync(dir.data(`${path}/log`));

  const logFile = Bun.file(logPath);
  await Bun.write(logFile, `loading site...`);

  if (!site.config.disable_lib) {
    if (!(await existsAsync(dir.data(`${path}/lib`)))) {
      appendFile(logPath, "\ncloning lib...");

      await $`git clone https://github.com/avolut/prasi-lib lib`
        .cwd(dir.data(path))
        .quiet();
    }
  }
  await ensureFiles(path, site.id, { disable_lib: !!site.config.disable_lib });

  appendFile(logPath, "\nnpm install...");
  await $`npm i`.cwd(dir.data(path)).quiet();

  appendFile(logPath, "\nbuilding frontend...");

  const rebuild = async () => {
    let has_error = false;
    let files: string[] = [];

    try {
      let ts = Date.now();
      const built = await buildFrontend(site.id);
      files = Object.keys(built.metafile.inputs);
      await Bun.write(logFile, `Build OK (${Date.now() - ts}ms)`);
    } catch (e: any) {
      const error_msg = formatMessagesSync(e.errors, { kind: "error" });
      await Bun.write(logFile, error_msg.join("\n"));
      console.log(
        `${c.red}[ERR]${c.esc} FrontEnd Build ${c.blue}${site.id}${c.esc}:`,
        error_msg.join("\n")
      );
    }

    const debouncedRebuild = (e: any, p: any) => {
      if (site.status !== "loading") {
        clearTimeout(site.change_timeout);
        site.change_timeout = setTimeout(rebuild, 300);
      }
    };

    if (
      !has_error &&
      (await existsAsync(dir.data(`/code/${site.id}/site/build/temp`)))
    ) {
      await removeAsync(dir.data(`/code/${site.id}/site/build/output`));
      await moveAsync(
        dir.data(`/code/${site.id}/site/build/temp`),
        dir.data(`/code/${site.id}/site/build/output`)
      );

      await buildFrontendTypings(site.id);

      if (!site.asset) {
        site.asset = await staticFile(
          dir.data(`/code/${site.id}/site/build/output`),
          { index: false }
        );
      } else {
        await site.asset.rescan();
      }

      const to_watch = files.filter((path) => !path.startsWith("node_modules"));

      Object.values(to_watch).map(async (file) => {
        const path = dir.data(`/code/${site.id}/site/src/${file}`);
        if (await existsAsync(path)) {
          if (!site.watcher[file]) {
            site.watcher[file] = watch(path, debouncedRebuild);
          }
        }
      });

      for (const k of Object.keys(site.watcher)) {
        if (!to_watch.includes(k)) {
          site.watcher[k].removeAllListeners().close();
          delete site.watcher[k];
        }
      }
    } else {
      if (!site.watcher["app"]) {
        for (const k of Object.keys(site.watcher)) {
          site.watcher[k].removeAllListeners().close();
          delete site.watcher[k];
        }
        ["app", "lib"].map((p) => {
          site.watcher[p] = watch(
            dir.data(`/code/${site.id}/site/src/${p}`),
            debouncedRebuild
          );
        });
      }
    }
  };
  await rebuild();
};
