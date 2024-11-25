import { $, argv } from "bun";
import { c } from "../srv/utils/color";
import { spawn } from "utils/spawn";
const is_debug = argv.includes("debug");

declare global {
  var reloadCount: number;
}

globalThis.reloadCount ??= 0;
globalThis.reloadCount++;
process.env.FORCE_COLOR = "1";

const dev = {
  backend: spawn({
    cmd: `bun run --silent --watch --no-clear-screen backend/srv/server.ts dev`,
    ipc: (msg) => {
      if (msg.resend_port && dev.prasi_port > 0) {
        dev.backend.process.send({
          prasi_port: dev.prasi_port,
          site_port: dev.site_port,
        });
      }
    }, 
    mode: "passthrough",
  }),
  prasi_port: 0,
  site_port: 0,
};

const getPort = (text: string) => {
  return parseInt(
    text.split("http://localhost:").pop()?.split("/").shift() || "0"
  );
};

const run = (cmd: string, cwd: string, prefix: string) => {
  let is_ready = false;

  return spawn({
    cmd,
    cwd,
    onMessage({ raw, text }) {
      if (cwd === "frontend") {
        if (dev.prasi_port === 0 && text.includes("http://localhost:")) {
          dev.prasi_port = getPort(text);
          dev.backend.process.send({ prasi_port: dev.prasi_port });
        }
      }

      if (cwd === "frontend/src/nova/prod") {
        if (dev.site_port === 0 && text.includes("http://localhost:")) {
          dev.site_port = getPort(text);
          dev.backend.process.send({ site_port: dev.site_port });
        }
      }

      if (text.includes("start")) {
        is_ready = true;
      }
      if (is_ready || is_debug) {
        process.stdout.write(prefix);
        process.stdout.write(raw);
      }
    },
  }).exited;
};

if (globalThis.reloadCount === 1) {
  const rsbuild = {
    frontend: run(
      `bun run --silent dev`,
      `frontend`,
      `${c.red}PRASI ▷  ${c.esc}`
    ),
    frontsite: run(
      `bunx rsbuild dev -m production`,
      `frontend/src/nova/prod`,
      `${c.magenta}SITES ▷  ${c.esc}`
    ),
  };

  await Promise.all([dev.backend, rsbuild.frontend, rsbuild.frontsite]);
}
