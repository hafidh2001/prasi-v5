import type { OnMount } from "@monaco-editor/react";
import trim from "lodash.trim";
export type MonacoEditor = Parameters<OnMount>[0];
type Monaco = Parameters<OnMount>[1];

export const monacoCreateModel = ({
  monaco,
  editor,
  source,
  filename,
  activate,
}: {
  editor: MonacoEditor;
  monaco: Monaco;
  source: string;
  filename: string;
  activate?: boolean;
}) => {
  const nmodel = monaco.editor.createModel(
    trim(source),
    "typescript",
    monaco.Uri.parse(filename)
  );
  if (activate) editor.setModel(nmodel);
  return nmodel;
};

export const monacoRegisterSource = (
  monaco: Monaco,
  source: string,
  uri: string
) => {
  const model = monaco.editor.getModels().find((e) => {
    return e.uri.toString() === uri;
  });

  if (model) {
    model.setValue(source);
  } else {
    monaco.editor.createModel(source, "typescript", monaco.Uri.parse(uri));
  }
};
