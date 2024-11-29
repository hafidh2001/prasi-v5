import { removeAsync } from "fs-jetpack";
import { platform } from "os";
import { PRASI_CORE_SITE_ID, waitUntil } from "prasi-utils";
import { fs } from "utils/fs";
import type { PrasiSiteLoading } from "utils/global";
import { asset } from "utils/server/asset";
import { spawn } from "utils/spawn";
import { broadcastVscUpdate } from "../utils/broadcast-vsc";
import { extractVscIndex } from "../utils/extract-vsc";
import { siteBroadcastBuildLog, siteLoadingMessage } from "./loading-msg";
import { siteReady } from "./site-ready";
import { $ } from "bun";

export const siteRun = async (site_id: string, loading: PrasiSiteLoading) => {
  await waitUntil(
    () =>
      fs.exists(`code:${site_id}/vsc/package.json`) &&
      fs.exists(`code:${site_id}/vsc/rsbuild.dev.ts`),
    { interval: 1000 }
  );

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
  if (!loading.deps_install) {
    loading.deps_install = spawn({
      cmd: `bun i`,
      cwd: fs.path(`code:${site_id}/vsc`),
      onMessage(arg) {
        siteBroadcastBuildLog(site_id, arg.text);
      },
    });
  }
  await loading.deps_install.exited;

  siteLoadingMessage(site_id, "Starting RSBuild...");

  await removeAsync(fs.path(`code:${site_id}/dist/log`));

  if (!loading.build.rsbuild) {
    loading.build.rsbuild = spawn({
      cmd: `bun dev`,
      cwd: fs.path(`code:${site_id}/vsc`),
      log: {
        max_lines: 300,
      },
      async onMessage(arg) {
        siteBroadcastBuildLog(site_id, arg.text);
        if (arg.text.includes("ready")) {
          if (g.site.loading[site_id]) {
            siteReady(site_id);
          } else {
            if (site_id === PRASI_CORE_SITE_ID) {
              asset.psc.rescan();
            }

            const site = g.site.loaded[site_id];
            if (site) {
              site.asset?.rescan();
            }

            broadcastVscUpdate(site_id, "rsbuild");
          }
        }
      },
    });
  }

  siteLoadingMessage(site_id, "Starting Typings Builder...");
  if (!loading.build.typings) {
    const tsc =
      platform() === "win32"
        ? "node_modules/.bin/tsc.exe"
        : "node_modules/.bin/tsc";

    const tsc_arg = `--watch --moduleResolution node --emitDeclarationOnly --isolatedModules false --outFile ./dist/typings-generated.d.ts --declaration --allowSyntheticDefaultImports true --noEmit false`;

    loading.build.typings = spawn({
      cmd: `${fs.path(`root:${tsc}`)} ${tsc_arg}`,
      cwd: fs.path(`code:${site_id}/vsc`),
      async onMessage(arg) {
        const site = g.site.loaded[site_id];
        if (
          arg.text.includes("Watching for file") &&
          site?.broadcasted.rsbuild
        ) {
          await extractVscIndex(site_id);
          broadcastVscUpdate(site_id, "tsc");
        }
      },
    });

    if (site_id === PRASI_CORE_SITE_ID) {
      const cmd = [
        ...`${fs.path(
          platform() === "win32"
            ? "root:node_modules/.bin/tsc.exe"
            : "root:node_modules/.bin/tsc"
        )} --project tsconfig.prasi.json --watch --moduleResolution node --emitDeclarationOnly --outFile prasi-typings-generated.d.ts --declaration --noEmit false`.split(
          " "
        ),
      ];

      Bun.spawn({
        cmd,
        cwd: fs.path(`root:frontend/src/nova/ed/cprasi`),
        stdio: ["ignore", "ignore", "ignore"],
      });
    }
  }
};
