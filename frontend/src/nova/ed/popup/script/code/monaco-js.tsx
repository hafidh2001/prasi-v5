import type { Monaco, OnMount } from "@monaco-editor/react";
import { FC } from "react";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { monacoEnableJSX } from "./js/enable-jsx";
import { useGlobal } from "utils/react/use-global";
import { EDGlobal } from "logic/ed-global";
import trim from "lodash.trim";
import { monacoCleanModel } from "./js/clean-models";
import { monacoCreateModel } from "./js/create-model";

export const MonacoJS: FC<{
  value: string;
  onChange: (value: string) => void;
  enableJsx?: boolean;
}> = ({ value, onChange }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const Editor = jscript.MonacoEditor;
  if (!Editor) return <Loading backdrop={false} note="loading-monaco" />;

  return (
    <Editor
      value={value}
      onChange={(value) => {
        onChange(value || "");
      }}
      language={"typescript"}
      options={{
        minimap: { enabled: false },
        wordWrap: "wordWrapColumn",
        autoClosingBrackets: "always",
        autoIndent: "full",
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 2,
        useTabStops: true,
        lineNumbersMinChars: 2,
      }}
      onMount={async (editor, monaco) => {
        monacoEnableJSX(editor, monaco, p);
        monacoCleanModel(monaco);
        monacoCreateModel({
          monaco,
          editor,
          filename: "file:///active.tsx",
          source: value,
          activate: true,
        });
      }}
    />
  );
};
