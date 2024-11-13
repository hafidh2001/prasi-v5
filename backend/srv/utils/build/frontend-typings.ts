import { spawn } from "bun";
import { dir } from "../dir";
import { platform } from "os";

export const buildFrontendTypings = async (site_id: string) => {
  const typings_log = Bun.file(
    dir.data(`/code/${site_id}/site/src/typings.log`)
  );
  await Bun.write(typings_log, "");
  const cmd = [
    ...`${dir.root(
      platform() === "win32"
        ? "node_modules/.bin/tsc.exe"
        : "node_modules/.bin/tsc"
    )} --moduleResolution node --emitDeclarationOnly --outFile ../typings.d.ts --declaration --noEmit false`.split(
      " "
    ),
  ];
  const tsc = Bun.spawn({
    cmd,
    cwd: dir.data(`/code/${site_id}/site/src`),
    stdio: [typings_log, typings_log, "ignore"],
  });
  await tsc.exited;
};
