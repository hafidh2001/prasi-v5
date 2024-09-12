import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: "./main.tsx" },
  },
  output: {
    cleanDistPath: true,
    sourceMap: {
      js: "source-map",
    },
    distPath: { root: "./../../../prod" },
    assetPrefix: "/nova"
  },
  dev: {
    liveReload: false,
    hmr: false,
    writeToDisk: true,
    progressBar: false,
    assetPrefix: "/nova"
  },
  server: {
    port: 14314,
  },
});
