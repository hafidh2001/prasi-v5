import type { Editor as MonacoEditor } from "@monaco-editor/react";
import type { parseSync } from "@oxc-parser/wasm";
import type { formatMessages, transform } from "esbuild-wasm";
import type estree from "prettier/plugins/estree";
import type ts from "prettier/plugins/typescript";
import type Prettier from "prettier/standalone";
import { SimpleVisitors } from "./parser/acorn-types";
import { traverse } from "./parser/traverse";

import {
  configureMonacoTailwindcss,
  tailwindcssData,
} from "monaco-tailwindcss";

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
  formatMessages: null as null | typeof formatMessages,
  parse: null as null | typeof parseSync,
  prettier: {
    standalone: null as null | typeof Prettier,
    estree: null as null | typeof estree,
    ts: null as null | typeof ts,
    format: async (source: string) => source,
  },
  getTailwindStyles: null as null | ((contents: string[]) => Promise<string>),
  loaded: false,
  traverse: (code: string, visitors: SimpleVisitors<any>) => {
    const ast = jscript.parse?.(code, {
      sourceFilename: "script.tsx",
      sourceType: "script",
    });

    if (ast) traverse(ast.program, visitors);
  },
  async init() {
    if (this.pending) {
      await this.pending;
    }
    if (!this.pending) {
      this.pending = new Promise<void>(async (resolve) => {
        await Promise.all([
          (async () => {
            this.prettier.standalone = (
              await import("prettier/standalone")
            ).default;
            this.prettier.estree = await import("prettier/plugins/estree");
            this.prettier.ts = await import("prettier/plugins/typescript");

            const prettier = jscript.prettier.standalone;
            const prettier_ts = jscript.prettier.ts;
            const prettier_estree = jscript.prettier.estree;

            if (prettier && prettier_estree && prettier_ts) {
              this.prettier.format = (source) =>
                prettier.format(source, {
                  parser: "typescript",
                  plugins: [prettier_ts, prettier_estree],
                  proseWrap: "always",
                  semi: false,
                  arrowParens: "always",
                  experimentalTernaries: true,
                  trailingComma: "none",
                  bracketSameLine: false,
                  bracketSpacing: true,
                });
            }
          })(),
          (async () => {
            const oxc = await import("@oxc-parser/wasm");
            (oxc.default as any)({});
            jscript.parse = oxc.parseSync;
          })(),
          (async () => {
            const esbuild = await import("esbuild-wasm");
            await esbuild.initialize({
              wasmURL: new URL("esbuild-wasm/esbuild.wasm", import.meta.url),
            });
            jscript.transform = esbuild.transform;
            jscript.formatMessages = esbuild.formatMessages;
          })(),
          (async () => {
            const monaco = await import("monaco-editor");
            const monaco_react = await import("@monaco-editor/react");
            monaco_react.loader.config({ monaco });

            self.MonacoEnvironment = {
              getWorker(_, label: any) {
                switch (label) {
                  case "editorWorkerService":
                    return new Worker(
                      new URL(
                        "monaco-editor/esm/vs/editor/editor.worker",
                        import.meta.url
                      )
                    );
                  case "css":
                  case "less":
                  case "scss":
                    return new Worker(
                      new URL(
                        "monaco-editor/esm/vs/language/css/css.worker",
                        import.meta.url
                      )
                    );
                  case "handlebars":
                  case "html":
                  case "razor":
                    return new Worker(
                      new URL(
                        "monaco-editor/esm/vs/language/html/html.worker",
                        import.meta.url
                      )
                    );
                  case "json":
                    return new Worker(
                      new URL(
                        "monaco-editor/esm/vs/language/json/json.worker",
                        import.meta.url
                      )
                    );
                  case "javascript":
                  case "typescript":
                    return new Worker(
                      new URL(
                        "monaco-editor/esm/vs/language/typescript/ts.worker",
                        import.meta.url
                      )
                    );
                  case "tailwindcss":
                    return new Worker(
                      new URL(
                        "monaco-tailwindcss/tailwindcss.worker",
                        import.meta.url
                      )
                    );
                  default:
                    throw new Error(`Unknown label ${label}`);
                }
              },
            };
            await monaco_react.loader.init();
            monaco.languages.css.cssDefaults.setOptions({
              data: {
                dataProviders: {
                  tailwindcssData,
                },
              },
            });
            const res = configureMonacoTailwindcss(monaco, {
              tailwindConfig: {
                blocklist: [
                  "absolute",
                  "flex",
                  "relative",
                  "inset-0",
                  "overflow-auto",
                  "block",
                  "flex",
                  "flex-row",
                  "border",
                  "px-1",
                  "p-1",
                  "m-1",
                  "space-x-1",
                  "flex-col",
                  "align-items",
                ],
              },
            });
            this.getTailwindStyles = async (contents: string[]) => {
              return await res.generateStylesFromContent(
                `@tailwind utilities;`,
                contents.map((e) => ({ content: e, extension: "tsx" }))
              );
            };
            jscript.MonacoEditor = monaco_react.Editor;
          })(),
        ]);
        resolve();
      });
      await this.pending;
      this.loaded = true;
    }
  },
};

export const cutCode = (code: string, pos: any, offset?: number) => {
  return code.substring(pos.start + (offset || 0), pos.end + (offset || 0));
};
