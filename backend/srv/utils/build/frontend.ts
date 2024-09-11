import globalExternals from "@fal-works/esbuild-plugin-global-externals";
import style from "@hyrious/esbuild-plugin-style";
import { build } from "esbuild";
import { dir } from "../dir";
import { cleanPlugin } from "./esbuild-clean-plugin";

export const buildFrontend = async (site_id: string) => {
  const out_dir_temp = dir.data(`code/${site_id}/site/build/temp`);

  const site_filename = "internal.tsx";
  const site_tsx = Bun.file(
    dir.data(`code/${site_id}/site/src/${site_filename}`)
  );
  if (!(await site_tsx.exists())) {
    await Bun.write(
      site_tsx,
      `\
import React from "react";

// export const Loading = () => {
//   return <></>;
// };

// export const NotFound = () => {
//   return <></>;
// };
`
    );
  }

  return await build({
    absWorkingDir: dir.data(`code/${site_id}/site/src`),
    entryPoints: ["index.tsx", site_filename],
    outdir: out_dir_temp,
    format: "esm",
    bundle: true,
    minify: true,
    treeShaking: true,
    splitting: true,
    logLevel: "silent",
    sourcemap: true,
    metafile: true,
    plugins: [
      cleanPlugin(),
      style(),
      globalExternals({
        react: {
          varName: "window.React",
          type: "cjs",
        },
        "react-dom": {
          varName: "window.ReactDOM",
          type: "cjs",
        },
      }),
    ],
  });
};
