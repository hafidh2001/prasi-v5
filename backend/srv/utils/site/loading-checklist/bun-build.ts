import { removeAsync } from "fs-jetpack";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { dirname } from "path";
import { watchFiles } from "utils/files/watch";
import { waitUntil } from "prasi-utils";

type BuildArg = {
  entrypoint: string;
  outdir: string;
  onBuild?: (arg: {
    ts: number;
    status: "success" | "failed" | "building";
    log?: string;
  }) => void;
};

export const bunWatchBuild = async ({
  outdir,
  entrypoint,
  onBuild,
}: BuildArg) => {
  const internal = {
    building: false,
    watching: null as null | ReturnType<typeof watchFiles>,
    log: "",
    stop: async () => {
      if (internal.watching) {
        for (const v of Object.values(internal.watching)) {
          v.close();
        }
      }

      if (internal.building) {
        await waitUntil(() => internal.building === false);
      }
    },
  };

  internal.watching = watchFiles({
    dir: dirname(entrypoint),
    events: async (type, filename) => {
      if (!internal.building) {
        internal.building = true;
        try {
          const ts = Date.now();
          internal.log += `Building...\n`;
          if (onBuild) onBuild({ ts, status: "building" });
          await bunBuild({ outdir, entrypoint });
          if (onBuild) onBuild({ ts: Date.now(), status: "success" });
          internal.log += `Build completed in ${Date.now() - ts}ms\n`;
        } catch (e: any) {
          if (onBuild)
            onBuild({ ts: Date.now(), status: "failed", log: e?.message });
          internal.log += `Build failed, reason: ${e?.message}\n`;
        }

        internal.building = false;
      }
    },
    exclude(pathname) {
      if (pathname.startsWith(".")) return true;
      if (pathname.startsWith("node_modules")) return true;
      return false;
    },
  });

  internal.building = true;
  try {
    const ts = Date.now();
    internal.log += `Building...\n`;
    if (onBuild) onBuild({ ts: Date.now(), status: "building" });
    await bunBuild({ outdir, entrypoint });
    if (onBuild) onBuild({ ts: Date.now(), status: "success" });
    internal.log += `Build completed in ${Date.now() - ts}ms\n`;
  } catch (e: any) {
    if (onBuild) onBuild({ ts: Date.now(), status: "failed", log: e?.message });
    internal.log += `Build failed, reason: ${e?.message}\n`;
  }
  internal.building = false;

  return internal;
};

export const bunBuild = async ({ outdir, entrypoint }: BuildArg) => {
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
