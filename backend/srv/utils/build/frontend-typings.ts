import { platform } from "os";
import { dir } from "../dir";

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
