import { activateItem, active } from "logic/active";
import { Monaco, MonacoEditor } from "./enable-jsx";
import { ScriptModel } from "crdt/node/load-script-models";
import { PG } from "logic/ed-global";
import { activateComp } from "crdt/load-comp-tree";
import { validate } from "uuid";

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
          if (prasi_model.id.endsWith("_jsxpass")) {
            for (const id of prasi_model.path_ids.reverse()) {
              const res = monaco.editor.getModel(
                monaco.Uri.parse(`file:///${id}.tsx`)
              );
              if ((res as any)?.prasi_model) {
                const m = (res as any).prasi_model;
                if (m.comp_def) {
                  if (active.comp_id !== m.comp_def.id) {
                    const id = input.resource.path.split("_")[1];
                    await activateComp(p, m.comp_def.id);
                    activateItem(p, id);
                  }
                  break;
                }
              }
            }
          } else {
            p.script.monaco_selection = input.options.selection;
            activateItem(p, prasi_model.id);
          }
        }
      }
      return result; // always return the base result
    };
  }
};
