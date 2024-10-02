import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { monacoCreateModel, monacoRegisterSource } from "./js/create-model";
import { Monaco, MonacoEditor, monacoEnableJSX } from "./js/enable-jsx";
import { jsxColorScheme } from "./js/jsx-style";
import { registerPrettier } from "./js/register-prettier";
import { registerReact } from "./js/register-react";
import { foldRegionVState } from "./js/fold-region-vstate";

export const MonacoJS: FC<{
  highlightJsx?: boolean;
  sidebar?: boolean;
  activeModel: string;
  models: {
    name: string;
    source: string;
    model?: ReturnType<typeof monacoCreateModel>;
    onChange?: (source: string, e: any) => void;
  }[];
  className?: string;
  nolib?: boolean;
  onMount?: (editor: MonacoEditor, monaco: Monaco) => void;
}> = ({ models, activeModel, className, nolib, onMount }) => {
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
          : {
              showWords: false,
              showKeywords: false,
            },
      }}
      onMount={async (editor, monaco) => {
        // monacoCleanModel(monaco);
        registerPrettier(monaco);
        await registerReact(monaco);

        const monacoModels = monaco.editor.getModels();
        for (const m of models) {
          if (!m.source) continue;

          const model = monacoModels.find(
            (e) => e === m.model || e.uri.toString() === m.name
          );
          if (model) {
            if (m.model && !m.model.isDisposed) {
              m.model.dispose();
            }
            m.model = model;
          } else {
            m.model = monacoRegisterSource(monaco, m.source, m.name);
          }

          if (m.name === activeModel && m.model) {
            editor.setModel(m.model);
            monacoEnableJSX(editor, monaco, { nolib }, p);
            editor.trigger(undefined, "editor.action.formatDocument", null);
            editor.restoreViewState(
              foldRegionVState(m.model.getLinesContent())
            );
          }
        }

        if (onMount) {
          onMount(editor, monaco);
        }
      }}
    />
  );
};
