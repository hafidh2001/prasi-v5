import type { Monaco, OnMount } from "@monaco-editor/react";
import { FC } from "react";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";

export const MonacoJS: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
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
    />
  );
};
