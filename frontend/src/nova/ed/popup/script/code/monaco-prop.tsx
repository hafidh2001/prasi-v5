import { Monaco } from "@monaco-editor/react";
import { ScriptModel } from "crdt/node/load-script-models";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC, useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { defineScriptEdit } from "../parts/do-edit";
import { MonacoEditor } from "./js/create-model";
import { jsxColorScheme } from "./js/jsx-style";
import { registerPrettier } from "./js/register-prettier";
import { registerReact } from "./js/register-react";
import { reloadPrasiModels, remountPrasiModels } from "./prasi-code-update";

export const EdMonacoProp: FC<{
  className?: string;
  onChange?: (arg: {
    value: string;
    model: Partial<ScriptModel>;
    editor: MonacoEditor;
    monaco: Monaco;
    event: any;
  }) => void;
  div?: React.RefObject<HTMLDivElement>;
}> = ({ className, onChange, div }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal(
    {
      editor: null as null | MonacoEditor,
      width: undefined as undefined | number,
      height: undefined as undefined | number,
      models: [] as ScriptModel[],
    },
    async () => {
      local.models = (await reloadPrasiModels(
        p,
        active.item_id
      )) as ScriptModel[];
      local.render();
    }
  );
  const Editor = jscript.MonacoEditor;
  const ui = p.ui.comp.prop;

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

  if (
    !Editor ||
    (div && (!local.width || !local.height)) ||
    local.models.length === 0
  )
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
      width={local.width}
      height={local.height}
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
        p.script.editor = editor;

        try {
          await registerReact(monaco);

          editor.onDidDispose(() => {
            local.editor = null;
          });
          local.editor = editor;
          p.script.do_edit = defineScriptEdit(editor, monaco);

          registerPrettier(monaco);
          await registerReact(monaco);

          remountPrasiModels({
            p,
            _models: local.models,
            activeFileName: `file:///${active.item_id}~${ui.active}.tsx`,
            editor,
            monaco,
            onChange,
          });
        } catch (e) {
          console.warn("Monaco Mount Error:", e);
        }
      }}
    />
  );
};
