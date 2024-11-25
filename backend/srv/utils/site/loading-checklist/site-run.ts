import { $ } from "bun";
import { fs } from "utils/fs";
import type { PrasiSiteLoading } from "utils/global";
import { siteLoadingMessage } from "./loading-msg";
import { spawn } from "utils/spawn";
import { platform } from "os";

export const siteRun = async (site_id: string, loading: PrasiSiteLoading) => {
  await fs.modify({
    path: `code:${site_id}/vsc/package.json`,
    save(content) {
      content.name = site_id;
      return content;
    },
  });

  await fs.modify({
    path: `code:${site_id}/vsc/rsbuild.dev.ts`,
    save(content) {
      const res = content.replace("[[site_id]]", site_id);
      return res;
    },
  });

  siteLoadingMessage(site_id, "Installing dependencies...");
  if (!loading.deps_install)
    loading.deps_install = $`bun i`.quiet().cwd(fs.path(`code:${site_id}/vsc`));
  await loading.deps_install;

  siteLoadingMessage(site_id, "Starting RSBuild...");

  if (!loading.build.rsbuild) {
    loading.build.rsbuild = spawn({
      cmd: `bun dev`,
      cwd: fs.path(`code:${site_id}/vsc`),
      log: {
        max_lines: 300,
      },
    });
  }

  siteLoadingMessage(site_id, "Starting Typings Builder...");
  if (!loading.build.typings) {
    const tsc =
      platform() === "win32"
        ? "node_modules/.bin/tsc.exe"
        : "node_modules/.bin/tsc";
    loading.build.typings = spawn({
      cmd: `${fs.path(`root:${tsc}`)} --watch --moduleResolution node --emitDeclarationOnly --outFile ./dist/typings-generated.d.ts --declaration --noEmit false`,
      cwd: fs.path(`code:${site_id}/vsc`),
    });
  }
};
