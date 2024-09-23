import type { Editor as MonacoEditor } from "@monaco-editor/react";
import type { transform } from "esbuild-wasm";
import type estree from "prettier/plugins/estree";
import type ts from "prettier/plugins/typescript";
import type Prettier from "prettier/standalone";
import { PG } from "../../nova/ed/logic/ed-global";
export type FBuild = (
  entryFileName: string,
  src: string,
  files?: Record<string, string>,
  verbose?: boolean
) => Promise<string>;

export const jscript = {
  MonacoEditor: null as typeof MonacoEditor | null,
  pending: null as null | Promise<void>,
  transform: null as null | typeof transform,
  prettier: {
    standalone: null as null | typeof Prettier,
    estree: null as null | typeof estree,
    ts: null as null | typeof ts,
  },
  async init() {
    if (this.pending) {
      await this.pending;
    }
    if (!this.pending) {
      this.pending = new Promise<void>(async (resolve) => {
        await Promise.all([
          // (async () => {
          //   this.prettier.standalone = (
          //     await import("prettier/standalone")
          //   ).default;
          //   this.prettier.estree = await import("prettier/plugins/estree");
          //   this.prettier.ts = await import("prettier/plugins/typescript");
          // })(),
          (async () => {
            const esbuild = await import("esbuild-wasm");
            await esbuild.initialize({
              wasmURL:
                "https://cdn.jsdelivr.net/npm/esbuild-wasm@0.24.0/esbuild.wasm",
            });
            jscript.transform = esbuild.transform;
          })(),
          (async () => {
            const monaco_react = await import("@monaco-editor/react");
            monaco_react.loader.config({
              paths: {
                vs: "/monaco/min/vs",
              },
            });
            jscript.MonacoEditor = monaco_react.Editor;
          })(),
        ]);
        resolve();
      });
      await this.pending;
    }
  },
};
