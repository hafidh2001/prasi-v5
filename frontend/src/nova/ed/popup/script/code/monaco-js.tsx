import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { monacoCleanModel } from "./js/clean-models";
import { monacoCreateModel, monacoRegisterSource } from "./js/create-model";
import { Monaco, MonacoEditor, monacoEnableJSX } from "./js/enable-jsx";
import { jsxColorScheme } from "./js/jsx-style";

export const MonacoJS: FC<{
  value: string;
  onChange: (value: string) => void;
  enableJsx?: boolean;
  models?: Record<string, string>;
  className?: string;
  nolib?: boolean;
  defaultValue?: string;
  onMount?: (editor: MonacoEditor, monaco: Monaco) => void;
}> = ({ value, onChange, models, defaultValue, className, nolib, onMount }) => {
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
      defaultValue={value || defaultValue}
      onChange={(value) => {
        onChange(value || "");
      }}
      className={cx(jsxColorScheme, className)}
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
        automaticLayout: true,
        fontFamily: "'Liga Menlo', monospace",
        fontLigatures: true,
        lineNumbersMinChars: 2,
        suggest: nolib
          ? {
              showSnippets: false,
              showWords: false,
              showKeywords: false,
              showModules: false, // disables `globalThis`, but also disables user-defined modules suggestions.
            }
          : undefined,
      }}
      onMount={async (editor, monaco) => {
        monacoCleanModel(monaco);
        monacoCreateModel({
          monaco,
          editor,
          filename: "file:///active.tsx",
          source: value || defaultValue || "",
          activate: true,
        });
        monacoEnableJSX(editor, monaco, { nolib }, p);

        if (models) {
          for (const [uri, source] of Object.entries(models)) {
            monacoRegisterSource(monaco, source, uri);
          }
        }

        if (onMount) {
          onMount(editor, monaco);
        }
      }}
    />
  );
};
