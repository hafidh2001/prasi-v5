import { removeAsync } from "fs-jetpack";
import * as React from "react";
import * as ReactDOM from "react-dom";

export const bunWatchBuild = () => {};

export const bunBuild = async ({
  outdir,
  entrypoint,
}: {
  entrypoint: string;
  outdir: string;
}) => {
  await removeAsync(outdir);
  return await Bun.build({
    entrypoints: [entrypoint],
    outdir: outdir,
    naming: {
      entry: "[dir]/[name].[ext]",
      chunk: "[name]-[hash].[ext]",
      asset: "[name]-[hash].[ext]",
    },
    format: "esm",
    experimentalCss: true,
    splitting: true,
    minify: true,
    define: { "process.env.NODE_ENV": '"production"' },
    sourcemap: "linked",
    plugins: [
      {
        name: "react-from-window",
        setup(build) {
          // Handle imports for 'react', 'react-dom', etc.
          build.onResolve({ filter: /^(react|react-dom)$/ }, (args) => {
            return {
              path: args.path,
              namespace: "react-window-ns",
            };
          });

          // Provide the implementation for resolved modules
          build.onLoad(
            { filter: /.*/, namespace: "react-window-ns" },
            (args) => {
              // Map module names to corresponding window global
              const moduleToGlobal: Record<string, string> = {
                react: "React",
                "react-dom": "ReactDOM",
              };

              const globalName = moduleToGlobal[args.path];

              if (!globalName) {
                throw new Error(`No global found for module: ${args.path}`);
              }

              return {
                contents:
                  args.path === "react"
                    ? `
                const moduleExports = window.React;
                export default moduleExports;
                export const { ${Object.keys(React).filter(
                  (e) => e !== "default"
                )} } = moduleExports;
              `
                    : `
                const moduleExports = window.ReactDOM;
                export default moduleExports;
                export const { ${Object.keys(ReactDOM).filter(
                  (e) => e !== "default"
                )} } = moduleExports;
              `,
                loader: "js",
              };
            }
          );
        },
      },
    ],
  });
};
