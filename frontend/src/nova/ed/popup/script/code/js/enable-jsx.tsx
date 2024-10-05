import type { OnMount } from "@monaco-editor/react";
import { PG } from "logic/ed-global";
import {
  getWorker,
  MonacoJsxSyntaxHighlight,
} from "monaco-jsx-syntax-highlight-v2";
export type MonacoEditor = Parameters<OnMount>[0];
export type Monaco = Parameters<OnMount>[1];

type CompilerOptions = Parameters<
  Parameters<OnMount>[1]["languages"]["typescript"]["typescriptDefaults"]["setCompilerOptions"]
>[0];

export const monacoEnableJSX = async (
  editor: MonacoEditor,
  monaco: Monaco,
  arg?: { nolib?: boolean },
  p?: PG
) => {
  monaco.languages.register({ id: "typescript" });
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
    // tapi kalau JsxEmit.React itu misal mau ada export, kudu ada import React from "react"
    jsx: monaco.languages.typescript.JsxEmit.React,
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
    lib: arg?.nolib ? [] : ["es6", "dom"],
    noLib: !!arg?.nolib,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    esModuleInterop: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
    compilerOptions
  );
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
