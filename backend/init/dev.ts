import { $, spawn } from "bun";
import { Readable } from "node:stream";
import { c } from "../srv/utils/color";
import { buildPrasiTypings } from "../srv/utils/editor/build-typings";

declare global {
  var reloadCount: number;
}

globalThis.reloadCount ??= 0;
globalThis.reloadCount++;
process.env.FORCE_COLOR = "1";

const run = async (rsbuild_command: string, cwd: string, kind: string) => {
  const proc = spawn({
    cmd: rsbuild_command.split(" "),
    cwd,
    stderr: "pipe",
    stdout: "pipe",
    env: { ...process.env, FORCE_COLOR: "1" },
  });
  const stdout = Readable.fromWeb(proc.stdout as any);

  let is_ready = false;
  for await (const x of stdout) {
    const buf = x as Buffer;
    if (!is_ready) {
      const text = buf
        .toString("utf-8")
        .trim()
        .replace(
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
          ""
        );
      if (text.startsWith("ready")) {
        is_ready = true;
      }
    } else {
      process.stdout.write(kind + " ");
      process.stdout.write(x);
    }
  }
};

if (globalThis.reloadCount === 1) {
  buildPrasiTypings();
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
