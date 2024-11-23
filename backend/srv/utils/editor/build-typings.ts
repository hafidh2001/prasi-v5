import { platform } from "os";
import { dir } from "../dir";

const build_running = {
  prasi: false,
};
export const buildPrasiTypings = async () => {
  if (!build_running.prasi) {
    build_running.prasi = true;
    const cmd = [
      ...`${dir.root(
        platform() === "win32"
          ? "node_modules/.bin/tsc.exe"
          : "node_modules/.bin/tsc"
      )} --project tsconfig.prasi.json --watch --moduleResolution node --emitDeclarationOnly --outFile prasi-typings-generated.d.ts --declaration --noEmit false`.split(
        " "
      ),
    ];

    const tsc = Bun.spawn({
      cmd,
      cwd: dir.root(`/frontend/src/nova/ed/cprasi`),
      stdio: ["ignore", "ignore", "ignore"],
    });
    await tsc.exited;
  }
};
