import { activateItem, active } from "logic/active";
import { Monaco, MonacoEditor } from "./enable-jsx";
import { ScriptModel } from "crdt/node/load-script-models";
import { PG } from "logic/ed-global";

export const registerEditorOpener = (
  editor: MonacoEditor,
  monaco: Monaco,
  p: PG
) => {
  const ed = editor as any;
  if (!(monaco as any).prasiOpenerRegistered) {
    (monaco as any).prasiOpenerRegistered = true;
    const editorService = ed._codeEditorService;
    const openEditorBase = editorService.openCodeEditor.bind(editorService);
    editorService.openCodeEditor = async (input: any, source: any) => {
      const result = await openEditorBase(input, source);
      if (result === null) {
        const model = monaco.editor.getModel(input.resource);
        const prasi_model = (model as any).prasi_model as ScriptModel;
        if (model && prasi_model.id) {
          p.script.monaco_selection = input.options.selection;
          activateItem(p, prasi_model.id);
          if (prasi_model.prop_name) {
          }
        }
      }
      return result; // always return the base result
    };
  }
};
