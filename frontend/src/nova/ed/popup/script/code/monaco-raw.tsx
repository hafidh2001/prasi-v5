import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { MonacoEditor } from "./js/create-model";
import { Monaco } from "./js/enable-jsx";
import { useGlobal } from "utils/react/use-global";
import { EDGlobal } from "logic/ed-global";

export const MonacoRaw: FC<{
  value: string;
  onChange?: (value: string) => void;
  lang: string;
  defaultValue?: string;
  div?: React.RefObject<HTMLDivElement>;
  onMount?: (arg: { monaco: Monaco; editor: MonacoEditor }) => void;
}> = ({ value, onChange, lang, defaultValue, div, onMount }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    editor: null as null | MonacoEditor,
    monaco: null as null | Monaco,
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

  useEffect(() => {
    if (!onChange) {
      local.editor?.setValue(value);

      if (onMount && local.editor && local.monaco)
        onMount({ editor: local.editor, monaco: local.monaco });
    }
  }, [value]);

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
        if (onChange) onChange(value || "");
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
        domReadOnly: !onChange,
        readOnly: !onChange,
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
      onMount={(editor, monaco) => {
        p.script.editor = editor;
        local.editor = editor;
        local.monaco = monaco;
        local.render();
        if (onMount) onMount({ editor, monaco });
      }}
    />
  );
};
