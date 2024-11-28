import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],

  source: {
    entry: {
      index: "./frontend/index.tsx",
      internal: "./frontend/internal.tsx",
      server: "./backend/server.ts",
    },
  },

  dev: {
    progressBar: false,
    liveReload: false,
    hmr: false,
    writeToDisk: true,
  },

  server: {
    open: false,
    compress: false,
    base: "/prod/[[site_id]]",
  },
  mode: "production",

  tools: {
    rspack: {
      output: {
        module: true,
        library: {
          type: "module",
        },
        clean: true,
      },
      externalsType: "window",
      externals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
      optimization: {
        usedExports: false,
      },
      ignoreWarnings: [
        /require function is used in a way/,
        /the request of a dependency is an expression/,
      ],
    },
  },

  output: {
    cleanDistPath: true,
    sourceMap: {
      js: "source-map",
    },

    distPath: { root: "./dist/dev" },
    filename: { js: `[name].js` },
  },
});
