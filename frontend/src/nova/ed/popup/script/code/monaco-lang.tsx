import { FC } from "react";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";

export const MonacoLang: FC<{
  value: string;
  onChange: (value: string) => void;
  lang: string;
  defaultValue?: string;
}> = ({ value, onChange, lang, defaultValue }) => {
  const Editor = jscript.MonacoEditor;
  if (!Editor)
    return (
      <div className="relative w-full h-full items-center justify-center flex flex-1">
        <Loading backdrop={false} note="loading-monaco-lang" />
      </div>
    );

  return (
    <Editor
      defaultValue={value || defaultValue}
      onChange={(value) => {
        onChange(value || "");
      }}
      loading={
        <div className="relative w-full h-full items-center justify-center flex flex-1">
          <Loading backdrop={false} note="loading-monaco" />
        </div>
      }
      language={lang}
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
      }}
    />
  );
};
