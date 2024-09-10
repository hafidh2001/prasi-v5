import { $ } from "bun";
import { dir } from "../dir";
import { ensureFiles } from "../editor/ensure-files";
import { dirAsync, existsAsync } from "fs-jetpack";
import { appendFile } from "node:fs/promises";

export const loadSite = (site_id: string) => {
  if (!g.site) {
    g.site = {};
  }
  g.site[site_id] ??= {
    loading: false,
    promises: [],
  };
  const site = g.site[site_id];

  return new Promise<any>(async (done) => {
    if (!site.loading) {
      site.loading = true;
      const path = `/code/${site_id}/site/src`;
      const logPath = dir.data(`${path}/log/frontend.log`);
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

      await dirAsync(dir.data(`${path}/log`));

      appendFile(logPath, "\nrunning rsbuild...");
      site.rsbuild = Bun.spawn([`npx`, `rsbuild`, `dev`, `-m`, `production`], {
        stdout: logFile,
        stderr: logFile,
        cwd: dir.data(path),
      });

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
