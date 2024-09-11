import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: "./main.tsx" },
  },
  output: {
    distPath: { root: "./../output" },
  },
  dev: {
    writeToDisk: true,
    progressBar: false,
  },
});
