import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { monacoCleanModel } from "./js/clean-models";
import { monacoCreateModel, monacoRegisterSource } from "./js/create-model";
import { monacoEnableJSX } from "./js/enable-jsx";

export const MonacoJS: FC<{
  value: string;
  onChange: (value: string) => void;
  enableJsx?: boolean;
  models?: Record<string, string>;
}> = ({ value, onChange, models }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const Editor = jscript.MonacoEditor;
  if (!Editor)
    return (
      <div className="relative w-full h-full items-center justify-center flex flex-1">
        <Loading backdrop={false} note="loading-editor" />
      </div>
    );

  return (
    <Editor
      defaultValue={value}
      onChange={(value) => {
        onChange(value || "");
      }}
      loading={
        <div className="relative w-full h-full items-center justify-center flex flex-1">
          <Loading backdrop={false} note="loading-monaco" />
        </div>
      }
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
        if (models) {
          for (const [uri, source] of Object.entries(models)) {
            monacoRegisterSource(monaco, source, uri);
          }
        }
      }}
    />
  );
};
