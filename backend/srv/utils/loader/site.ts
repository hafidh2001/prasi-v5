import { $ } from "bun";
import { watch } from "fs";
import { dirAsync, existsAsync, moveAsync, removeAsync } from "fs-jetpack";
import { appendFile } from "node:fs/promises";
import { buildFrontend } from "../build/frontend";
import { dir } from "../dir";
import { ensureFiles } from "../editor/ensure-files";
import { formatMessagesSync } from "esbuild";

export const loadSite = (site_id: string) => {
  if (!g.site) {
    g.site = {};
  }
  g.site[site_id] ??= {
    loading: false,
    promises: [],
    watcher: {},
    change_timeout: null,
  };
  const site = g.site[site_id];
  if (site.watcher) {
    for (const [k, watcher] of Object.entries(site.watcher)) {
      watcher.removeAllListeners().close();
      delete site.watcher[k];
    }
  }

  return new Promise<any>(async (done) => {
    if (!site.loading) {
      site.loading = true;
      const path = `/code/${site_id}/site/src`;
      const logPath = dir.data(`${path}/log/frontend.log`);
      await dirAsync(dir.data(`${path}/log`));

      const logFile = Bun.file(logPath);
      await Bun.write(logFile, `loading site...`);

      await ensureFiles(path, site_id);
      if (!(await existsAsync(dir.data(`${path}/lib`)))) {
        appendFile(logPath, "\ncloning lib...");

        await $`git clone https://github.com/avolut/prasi-lib lib`
          .cwd(dir.data(path))
          .quiet();
      }

      appendFile(logPath, "\nnpm install...");
      await $`npm i`.cwd(dir.data(path)).quiet();

      appendFile(logPath, "\nbuilding frontend...");

      const rebuild = async () => {
        site.loading = true;

        let has_error = false;
        let files: string[] = [];

        try {
          let ts = Date.now();
          const built = await buildFrontend(site_id);
          files = Object.keys(built.metafile.inputs);
          Bun.write(logFile, `Build OK (${Date.now() - ts}ms)`);
        } catch (e: any) {
          Bun.write(logFile, formatMessagesSync(e.errors, { kind: "error" }));
        }
        const rebuildWithTimeer = (e: any, p: any) => {
          if (!site.loading) {
            clearTimeout(site.change_timeout);
            site.change_timeout = setTimeout(rebuild, 300);
          }
        };
        
        if (
          !has_error &&
          (await existsAsync(dir.data(`/code/${site_id}/site/build/temp`)))
        ) {
          await removeAsync(dir.data(`/code/${site_id}/site/build/output`));
          await moveAsync(
            dir.data(`/code/${site_id}/site/build/temp`),
            dir.data(`/code/${site_id}/site/build/output`)
          );

          const to_watch = files.filter(
            (path) => !path.startsWith("node_modules")
          );

          Object.values(to_watch).map(async (file) => {
            const path = dir.data(`/code/${site_id}/site/src/${file}`);
            if (await existsAsync(path)) {
              if (!site.watcher[file]) {
                site.watcher[file] = watch(path, rebuildWithTimeer);
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
                dir.data(`/code/${site_id}/site/src/${p}`),
                rebuildWithTimeer
              );
            });
          }
        }
        site.loading = false;
      };
      await rebuild();

      site.loading = false;
    } else {
      site.promises.push(done);
    }
  });
};

export const siteLoaded = (site_id: string) => {
  if (!g.site) {
    g.site = {};
  }
  if (!g.site[site_id]) return false;
  return true;
};

export const siteLoading = (site_id: string) => {
  if (!g.site) {
    g.site = {};
  }
  if (!g.site[site_id]) return false;
  if (g.site[site_id].loading) return true;
  return false;
};
