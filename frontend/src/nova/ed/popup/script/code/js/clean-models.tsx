import type { OnMount } from "@monaco-editor/react";
export type MonacoEditor = Parameters<OnMount>[0];
type Monaco = Parameters<OnMount>[1];

export const monacoCleanModel = (monaco: Monaco) => {
  monaco.editor.getModels().forEach((model) => {
    if (
      model.uri.toString().startsWith("inmemory://model") ||
      model.uri.toString().startsWith("file://")
    ) {
      model.dispose();
    }
  });
};
