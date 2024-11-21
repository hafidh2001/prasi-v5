import { ScriptModel } from "crdt/node/load-script-models";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC, useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { defineScriptEdit } from "../parts/do-edit";
import { Monaco, MonacoEditor } from "./js/enable-jsx";
import { jsxColorScheme } from "./js/jsx-style";
import { registerPrettier } from "./js/register-prettier";
import { registerReact } from "./js/register-react";
import { reloadPrasiModels, remountPrasiModels } from "./prasi-code-update";
import { defaultCode } from "./js/default-code";

export const MonacoItemJS: FC<{
  onChange?: (arg: {
    value: string;
    model: Partial<ScriptModel>;
    editor: MonacoEditor;
    monaco: Monaco;
    event: any;
  }) => void;
  className?: string;
  div?: React.RefObject<HTMLDivElement>;
}> = ({ className, onChange, div }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    editor: null as null | MonacoEditor,
    width: undefined as undefined | number,
    height: undefined as undefined | number,
    loading: true,
  });
  const Editor = jscript.MonacoEditor;

  useEffect(() => {
    const preventCtrlP = function (event: any) {
      if (
        event.keyCode === 80 &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey
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
        <Loading backdrop={false} note="loading-editor" />
      </div>
    );

  return (
    <>
      {local.loading && (
        <div className="absolute inset-0">
          <div className="relative w-full h-full items-center justify-center flex flex-1">
            <Loading backdrop={false} note="loading-script-model" />
          </div>
        </div>
      )}
      <Editor
        key={active.item_id + p.ui.comp.prop.active}
        className={cx(jsxColorScheme, className)}
        loading={
          <div className="relative w-full h-full items-center justify-center flex flex-1">
            <Loading backdrop={false} note="loading-monaco-editor" />
          </div>
        }
        width={local.width}
        height={local.height}
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
          suggest: {
            showWords: false,
            showKeywords: false,
          },
        }}
        onMount={async (editor, monaco) => {
          const models = await reloadPrasiModels(p, "monaco-item-js");

          p.script.editor = editor;

          editor.onDidDispose(() => {
            local.editor = null;
          });
          local.editor = editor;
          p.script.do_edit = defineScriptEdit(editor, monaco);

          remountPrasiModels({
            p,
            models,
            activeFileName: `file:///${active.item_id}.tsx`,
            editor,
            monaco,
            onChange,
            onMount: async (m) => {
              await registerReact(monaco);
              registerPrettier(monaco);

              if (!m) {
                defaultCode.js(p);
              }

              local.loading = false;
              local.render();
            },
          });
        }}
      />
    </>
  );
};
