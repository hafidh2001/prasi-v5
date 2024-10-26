import { ScriptModel } from "crdt/node/load-script-models";
import { EDGlobal } from "logic/ed-global";
import { FC, useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { defineScriptEdit } from "../parts/do-edit";
import { monacoRegisterSource } from "./js/create-model";
import { registerEditorOpener } from "./js/editor-opener";
import { Monaco, MonacoEditor, monacoEnableJSX } from "./js/enable-jsx";
import { foldRegionVState } from "./js/fold-region-vstate";
import { jsxColorScheme } from "./js/jsx-style";
import { registerPrettier } from "./js/register-prettier";
import { registerReact } from "./js/register-react";
import { extractRegion } from "./js/migrate-code";

export const MonacoJS: FC<{
  highlightJsx?: boolean;
  sidebar?: boolean;
  activeModel: string;
  models: Partial<ScriptModel>[];
  onChange?: (arg: {
    value: string;
    model: Partial<ScriptModel>;
    editor: MonacoEditor;
    monaco: Monaco;
    event: any;
  }) => void;
  className?: string;
  nolib?: boolean;
  onAfterMount?: (editor: MonacoEditor, monaco: Monaco) => void;
  onReloadModels?: (editor: MonacoEditor, monaco: Monaco) => Promise<any[]>;
}> = ({
  models,
  activeModel,
  className,
  nolib,
  onAfterMount,
  onReloadModels,
  onChange,
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    editor: null as null | MonacoEditor,
  });
  const Editor = jscript.MonacoEditor;

  useEffect(() => {
    const preventCtrlP = function (event: any) {
      const w = window as any;
      if (
        local.editor &&
        event.keyCode === 80 &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        (!event.shiftKey || w.chrome || w.opera)
      ) {
        event.preventDefault();
        if (event.stopImmediatePropagation) {
          event.stopImmediatePropagation();
        } else {
          event.stopPropagation();
        }
        local.editor?.trigger(
          "ctrl-shift-p",
          "editor.action.quickCommand",
          null
        );
        return;
      }
    };
    window.addEventListener("keydown", preventCtrlP, true);
    return () => {
      p.script.do_edit = (() => {}) as any;
      window.removeEventListener("keydown", preventCtrlP, true);
    };
  }, []);

  if (!Editor)
    return (
      <div className="relative w-full h-full items-center justify-center flex flex-1">
        <Loading backdrop={false} note="loading-monaco" />
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
        let _models = models;
        if (onReloadModels) {
          _models = await onReloadModels(editor, monaco);
        }

        editor.onDidDispose(() => {
          local.editor = null;
        });
        local.editor = editor;
        p.script.do_edit = defineScriptEdit(editor, monaco, p);

        registerPrettier(monaco);
        await registerReact(monaco);

        const monacoModels = monaco.editor.getModels();

        for (const m of _models) {
          if (!m.source && m.name !== activeModel) continue;
          if (!m.source) m.source = "";

          const model = monacoModels.find(
            (e) => e === m.model || e.uri.toString() === m.name
          );

          if (model) {
            if (m.model && !m.model.isDisposed) {
              m.model.dispose();
            }
            m.model = model;
            m.model.setValue(m.source);
          } else {
            m.model = monacoRegisterSource(monaco, m.source, m.name || "");
            m.model.onDidChangeContent((e) => {
              if (onChange && m.model) {
                let respect_ignore_changes = true;
                if (p.script.snippet_pasted) {
                  respect_ignore_changes = false;
                  p.script.snippet_pasted = false;
                }
                if (respect_ignore_changes) {
                  if (m.model._ignoreChanges || p.script.ignore_changes) {
                    p.script.ignore_changes = false;
                    delete m.model._ignoreChanges;
                    return;
                  }
                }

                const value = m.model.getValue();
                if (value) {
                  const region = extractRegion(value);
                  const local_name = region.find((e) =>
                    e.trim().startsWith('const local_name')
                  );
                  if (local_name) {
                    m.local = {
                      name: new Function(`${local_name}; return local_name;`)(),
                      value: m.local?.value || "",
                    };
                  }
                }

                onChange({
                  value: value,
                  model: m,
                  event: e,
                  editor,
                  monaco,
                });
              }
            });
          }

          if (m.model) {
            (m.model as any).prasi_model = m;
          }

          if (m.name === activeModel && m.model && !m.model.isDisposed()) {
            editor.setModel(m.model);
            registerEditorOpener(editor, monaco, p);
            monacoEnableJSX(editor, monaco, { nolib }, p);

            editor.restoreViewState(
              foldRegionVState(m.model.getLinesContent())
            );

            if (p.script.monaco_selection) {
              let i = 0;
              const ival = setInterval(() => {
                if (i < 5) {
                  editor.focus();
                  editor.setSelection(p.script.monaco_selection);
                } else {
                  p.script.monaco_selection = null;

                  clearInterval(ival);
                }
                i++;
              }, 50);
            }
          }
        }

        if (onAfterMount) {
          onAfterMount(editor, monaco);
        }
      }}
    />
  );
};
