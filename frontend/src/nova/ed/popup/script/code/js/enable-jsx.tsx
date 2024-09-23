import type { OnMount } from "@monaco-editor/react";
import { PG } from "logic/ed-global";
import {
  getWorker,
  MonacoJsxSyntaxHighlight,
} from "monaco-jsx-syntax-highlight-v2";
export type MonacoEditor = Parameters<OnMount>[0];
type Monaco = Parameters<OnMount>[1];

type CompilerOptions = Parameters<
  Parameters<OnMount>[1]["languages"]["typescript"]["typescriptDefaults"]["setCompilerOptions"]
>[0];

export const monacoEnableJSX = async (
  editor: MonacoEditor,
  monaco: Monaco,
  p?: PG
) => {
  monaco.languages.register({ id: "typescript" });
  const m = monaco as any;
  m.customJSMounted = true;

  if (editor.getModel()) {
    const jsxHgController = new MonacoJsxSyntaxHighlight(getWorker(), monaco);
    const { highlighter } = jsxHgController.highlighterBuilder({
      editor: editor,
    });

    if (typeof editor.getModel === "function") {
      highlighter();
    }
    editor.onDidChangeModelContent(() => {
      if (typeof editor.getModel === "function") {
        try {
          highlighter();
        } catch (e) {}
      }
    });
  }

  const compilerOptions: CompilerOptions = {
    // note: ReactJSX ga bisa solve type buat <div> etc...
    // yg bisa solve cmn JsxEmit.React
    jsx: monaco.languages.typescript.JsxEmit.React,
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
    lib: ["esnext", "dom"],
    module: monaco.languages.typescript.ModuleKind.ESNext,
    esModuleInterop: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
    compilerOptions
  );

  monaco.languages.typescript.typescriptDefaults.setExtraLibs([
    {
      filePath: "csstype.d.ts",
      content: `declare module "csstype" {
${await loadText("https://cdn.jsdelivr.net/npm/csstype@3.1.3/index.d.ts")}
}`,
    },
    {
      filePath: "prop-types.d.ts",
      content: `declare module "prop-types" {
${await loadText(
  "https://cdn.jsdelivr.net/npm/@types/prop-types@15.7.12/index.d.ts"
)}
}`,
    },
    {
      filePath: "react.d.ts",
      content: `
${await loadText("https://cdn.jsdelivr.net/npm/@types/react@18.3.3/index.d.ts")}
`,
    },
    {
      filePath: "jsx-runtime.d.ts",
      content: `declare module "react/jsx-runtime" {
import * as React from "./";
export { Fragment } from "./";

export namespace JSX {
  type ElementType = React.JSX.ElementType;
}

/**
* Create a React element.
*
* You should not use this function directly. Use JSX and a transpiler instead.
*/
export function jsx(
  type: React.ElementType,
  props: unknown,
  key?: React.Key,
): React.ReactElement;

/**
* Create a React element.
*
* You should not use this function directly. Use JSX and a transpiler instead.
*/
export function jsxs(
  type: React.ElementType,
  props: unknown,
  key?: React.Key,
): React.ReactElement;
`,
    },
  ]);

  console.log("registered");
};

export const register = (monaco: Monaco, source: string, uri: string) => {
  const model = monaco.editor.getModels().find((e) => {
    return e.uri.toString() === uri;
  });

  if (model) {
    model.setValue(source);
  } else {
    monaco.editor.createModel(source, "typescript", monaco.Uri.parse(uri));
  }
};

const loadText = async (url: string) => {
  try {
    const res = await fetch(url);
    return await res.text();
  } catch (e) {
    return "";
  }
};
