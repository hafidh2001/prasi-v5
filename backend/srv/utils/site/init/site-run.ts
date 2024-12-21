import { removeAsync } from "fs-jetpack";
import { platform } from "os";
import { PRASI_CORE_SITE_ID, waitUntil } from "prasi-utils";
import { fs } from "utils/files/fs";
import type { PrasiSite, PrasiSiteLoading } from "utils/global";
import { asset } from "utils/server/asset";
import { spawn } from "utils/spawn";
import { extractVscIndex } from "../utils/extract-vsc";
import { bunWatchBuild } from "./bun-build";
import { siteBroadcastBuildLog, siteLoadingMessage } from "./loading-msg";
import { siteLoaded } from "./site-loaded";
import { editor } from "utils/editor";
import { gzipSync } from "bun";

export const siteRun = async (site_id: string, loading: PrasiSiteLoading) => {
  await waitUntil(() => fs.exists(`code:${site_id}/site/src`), {
    interval: 1000,
  });

  siteLoadingMessage(site_id, "Installing dependencies...");
  if (!loading.deps_install) {
    loading.deps_install = spawn({
      cmd: `bun i`,
      cwd: fs.path(`code:${site_id}/site/src`),
      onMessage(arg) {
        siteBroadcastBuildLog(site_id, arg.text);
      },
    });
  }
  await loading.deps_install.exited;

  siteLoadingMessage(site_id, "Starting Frontend Build...");

  const prasi: PrasiSite["prasi"] = await fs.read(
    `code:${site_id}/site/src/prasi.json`,
    "json"
  );

  for (const log of Object.values(prasi.log_path)) {
    await removeAsync(fs.path(`code:${site_id}/site/src/${log}`));
  }

  if (!loading.process.build_frontend) {
    loading.process.build_frontend = await bunWatchBuild({
      outdir: fs.path(`code:${site_id}/site/build/frontend`),
      entrydir: fs.path(`code:${site_id}/site/src`),
      entrypoint: [prasi.frontend.index, prasi.frontend.internal],
      async onBuild({ status, log }) {
        const site = g.site.loaded[site_id];
        if (site) {
          site.process.log.build_frontend += log;
        }
        if (status === "building") {
          siteBroadcastBuildLog(site_id, "Building FrontEnd...");
        }

        if (status === "success") {
          siteBroadcastBuildLog(site_id, "Done");

          if (g.site.loading[site_id]) {
            await siteLoaded(site_id, prasi);
          }

          if (site_id === PRASI_CORE_SITE_ID) {
            asset.psc.rescan();
          }

          const site = g.site.loaded[site_id];
          if (site) {
            const is_ready = site.process.is_ready;
            is_ready.frontend = true;
            if (is_ready.typings) {
              const tsc = await fs.read(
                `code:${site_id}/site/src/${site.prasi.frontend.typings}`
              );
              editor.broadcast(
                { site_id },
                {
                  action: "vsc-update",
                  tsc: gzipSync(tsc),
                  vars: site.process.vsc_vars,
                }
              );
            }
          }
        } else {
          siteBroadcastBuildLog(site_id, log || "");
        }
      },
    });
  }

  siteLoadingMessage(site_id, "Starting Backend Build...");
  if (!loading.process.build_backend) {
    loading.process.build_backend = spawn({
      cmd: `bun build --target bun --watch ${prasi.backend.index} --outfile ../build/backend.js --no-clear-screen`,
      cwd: fs.path(`code:${site_id}/site/src`),
      async onMessage(arg) {
        const site = g.site.loaded[site_id];
        if (!site) {
          await waitUntil(() => g.site.loaded[site_id]);
        }
        site.build.run_backend?.send({
          type: "server-built",
          path: fs.path(`code:${site_id}/site/src`),
        });
        const log = site.process.log;
        log.build_backend += arg.text;
      },
    });
  }

  siteLoadingMessage(site_id, "Starting Backend Server...");
  if (!loading.process.run_backend) {
    loading.process.run_backend = {
      async send(msg) {
        if (!this.spawn.process?.send) {
          await waitUntil(() => this.spawn.process?.send!);
        }

        if (this.spawn.process) {
          this.spawn.process.send(msg);
        }
      },
      spawn: spawn({
        cmd: `bun ipc`,
        cwd: fs.path(`data:site-srv`),
        restart_on_exit: true,
        ipc(
          msg: { type: "init" } | { type: "ready"; port: number },
          subprocess
        ) {
          if (loading.process.run_backend) {
            if (msg.type === "init") {
              subprocess.send({
                type: "start",
                path: {
                  asset: fs.path(`code:${site_id}/site/build/frontend`),
                },
              });
            } else {
              loading.process.run_backend.port = msg.port;
            }
          }
        },
        async onMessage(arg) {
          const site = g.site.loaded[site_id];
          if (!site) {
            await waitUntil(() => site);
          }
          const log = site.process.log;
          log.run_server += arg.text;

          process.stdout.write(">>> ");
          process.stdout.write(arg.raw);
        },
      }),
      port: 0,
    };
  }

  siteLoadingMessage(site_id, "Starting Typings Builder...");
  if (!loading.process.build_typings) {
    const tsc =
      platform() === "win32"
        ? "node_modules/.bin/tsc.exe"
        : "node_modules/.bin/tsc";

    const tsc_arg = `--watch --moduleResolution node --emitDeclarationOnly --isolatedModules false --outFile ./${prasi.frontend.typings} --declaration --allowSyntheticDefaultImports true --noEmit false`;

    const typings = {
      done: () => {},
      promise: null as any,
    };
    typings.promise = new Promise<void>((resolve) => {
      typings.done = resolve;
    });

    loading.process.build_typings = spawn({
      cmd: `${fs.path(`root:${tsc}`)} ${tsc_arg}`,
      cwd: fs.path(`code:${site_id}/site/src`),
      async onMessage(arg) {
        const site = g.site.loaded[site_id];

        if (!site) {
          await waitUntil(() => site);
        }
        const log = site.process.log;
        log.build_typings += arg.text;

        if (site && arg.text.includes("Watching for file")) {
          site.process.is_ready.typings = true;
          typings.done();
          await extractVscIndex(site_id);

          const tsc = await fs.read(
            `code:${site_id}/site/src/${site.prasi.frontend.typings}`
          );

          editor.broadcast(
            { site_id },
            {
              action: "vsc-update",
              tsc: gzipSync(tsc),
              vars: site.process.vsc_vars,
            }
          );
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

    await typings.promise;
  }
};
