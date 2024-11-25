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

const run = (cmd: string, cwd: string, prefix: string) => {
  let is_ready = false;

  return spawn({
    cmd,
    cwd,
    onMessage({ raw, text }) {
      if (is_ready || is_debug) {
        process.stdout.write(prefix);
        process.stdout.write(raw);
      }

      if (text.includes("ready")) {
        is_ready = true;
      }
    },
  }).exited;
};

if (globalThis.reloadCount === 1) {
  const dev = {
    backend: $`bun run --silent --watch --no-clear-screen backend/srv/server.ts dev`,
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

  await Promise.all([dev.backend, dev.frontend, dev.frontsite]);
}
