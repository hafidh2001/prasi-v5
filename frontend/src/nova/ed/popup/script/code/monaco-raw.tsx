import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { MonacoEditor } from "./js/create-model";

export const MonacoRaw: FC<{
  value: string;
  onChange: (value: string) => void;
  lang: string;
  defaultValue?: string;
  div?: React.RefObject<HTMLDivElement>;
}> = ({ value, onChange, lang, defaultValue, div }) => {
  const local = useLocal({
    editor: null as null | MonacoEditor,
    width: undefined as undefined | number,
    height: undefined as undefined | number,
  });

  const Editor = jscript.MonacoEditor;
  useEffect(() => {
    const el = div?.current;
    if (el) {
      const observer = new ResizeObserver((entries) => {
        const rect = entries[0].contentRect;
        local.width = rect.width;
        local.height = rect.height;
        local.render();
        local.editor?.layout();
      });
      observer.observe(el);

      return () => {
        observer.unobserve(el);
      };
    }
  }, [div?.current]);

  if (!Editor || (div && (!local.width || !local.height)))
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
      width={local.width}
      height={local.height}
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