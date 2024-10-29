import { ScriptModel } from "crdt/node/load-script-models";
import { active, getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { waitUntil } from "prasi-utils";
import { cutCode, jscript } from "utils/script/jscript";
import { MonacoEditor, monacoRegisterSource } from "./js/create-model";
import { defaultCode as dcode } from "./js/default-code";
import { registerEditorOpener } from "./js/editor-opener";
import { Monaco, monacoEnableJSX } from "./js/enable-jsx";
import { foldRegionVState } from "./js/fold-region-vstate";
import { extractRegion, removeRegion } from "./js/migrate-code";
import { replaceString } from "./js/replace-string";
import { typingsItem } from "./js/typings-item";
import { getActiveNode } from "crdt/node/get-node-by-id";

export const reloadPrasiModels = async (p: PG, id: string) => {
  const tree = getActiveTree(p);
  await tree.reloadScriptModels();

  return [
    {
      name: "file:///typings-item.ts",
      source: typingsItem,
    },
    ...Object.values(tree.script_models),
  ];
};

export const remountPrasiModels = (arg: {
  p: PG;
  _models: Partial<ScriptModel>[];
  monaco: Monaco;
  editor: MonacoEditor;
  activeFileName: string;
  onChange?: (arg: {
    value: string;
    model: Partial<ScriptModel>;
    editor: MonacoEditor;
    monaco: Monaco;
    event: any;
  }) => void;
  onMount?: (m: Partial<ScriptModel>) => void;
}) => {
  const { p, _models, monaco, activeFileName, onChange, editor, onMount } = arg;

  const defaultCode = () => {
    const item = getActiveNode(p)?.item;
    if (item?.component?.props[p.ui.comp.prop.active]) {
      return dcode.prop(p, p.ui.comp.prop.active);
    }
    return dcode.js(p);
  };

  const monacoModels = monaco.editor.getModels();
  for (const m of _models) {
    if (!m.source && m.name !== activeFileName) continue;
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
      m.model.onDidChangeContent(async (e) => {
        if (onChange && m.model) {
          const value = m.model.getValue();

          if (p.script.ignore_changes) {
            p.script.ignore_changes = false;
            return;
          } else {
            if (!value) {
              p.script.ignore_changes = true;
              p.script
                .do_edit(async () => defaultCode().trim().split("\n"))
                .then(() => {
                  setTimeout(() => {
                    if (m.model) {
                      editor.restoreViewState(
                        foldRegionVState(m.model.getLinesContent())
                      );
                    }
                  }, 100);
                });
              editor.restoreViewState(
                foldRegionVState(m.model.getLinesContent())
              );
            }
          }

          const region = extractRegion(value);
          const local_name = region.find((e) =>
            e.trim().startsWith("const local_name")
          );
          if (local_name) {
            m.local = {
              auto_render: false,
              name: new Function(`${local_name}; return local_name;`)(),
              value: m.local?.value || "",
            };
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

    if (m.name === activeFileName && m.model && !m.model.isDisposed()) {
      if (!m.model.getValue()) {
        m.source = defaultCode().trim();
        m.model.setValue(m.source);
      }

      registerEditorOpener(editor, monaco, p);
      monacoEnableJSX(editor, monaco);

      if ((m.model as any)?.__isDisposing) return;
      editor.setModel(m.model);

      editor.restoreViewState(foldRegionVState(m.model.getLinesContent()));

      if (onMount) onMount(m);

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
};

export const codeUpdate = {
  p: null as any,
  timeout: null as any,
  queue: {} as Record<
    string,
    {
      id: string;
      source: string;
      tailwind?: string;
      prop_name?: string;
      source_built?: string | null;
      local_name?: string;
    }
  >,
  push(
    p: PG,
    id: string,
    source: string,
    arg?: { prop_name?: string; local_name?: string }
  ) {
    this.p = p;
    this.queue[id] = { id, source, ...arg };
    this.executeUpdate();
  },
  executeUpdate() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      if (!jscript.loaded) {
        await waitUntil(() => jscript.loaded);
      }

      _api.code_history({ mantapp: "jiwa" });

      for (const q of Object.values(this.queue)) {
        q.source_built = null;
        try {
          if (!q.source.trim()) {
            q.source_built = undefined;
            continue;
          }

          let final_source = "";
          if (q.prop_name) {
            final_source = removeRegion(q.source).replace(
              `export const ${q.prop_name} =`,
              ""
            );
          } else {
            const lines = q.source.split("\n").map((e) => {
              if (e.startsWith("export const")) {
                return e.replace("export const", "const");
              }
              return e;
            });

            let source = "";
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].startsWith("// #endregion")) {
                source = lines.slice(i + 1).join("\n");
                break;
              }
            }

            if (q.local_name) {
              source = `const local_name = "${q.local_name}";\n${source}`;
            }

            let replace = { replacement: "", start: 0, end: 0 };
            jscript.traverse(source, {
              ExportDefaultDeclaration(node) {
                replace.start = node.start;
                replace.end = node.end;
                if (node.declaration?.body) {
                  replace.replacement = `render(${cutCode(source, node.declaration.body)})`;
                }
              },
            });

            final_source = replaceString(source, [replace]);
          }

          if (final_source.trim()) {
            const tailwind = await jscript.getTailwindStyles?.([final_source]);
            if (typeof tailwind === "string") {
              q.tailwind = tailwind;
            }

            try {
              q.source_built = (
                await jscript.transform?.(final_source, {
                  jsx: "transform",
                  format: "cjs",
                  logLevel: "silent",
                  loader: "tsx",
                })
              )?.code;
            } catch (e) {
              console.warn("Code transpile failed on item:", q.id);
            }
          } else {
            q.source_built = undefined;
          }
        } catch (e: any) {
          console.warn("Code transpile failed on item:", q.id, e.message);
        }
      }

      getActiveTree(this.p).update("Update Code", ({ findNode }) => {
        for (const q of Object.values(this.queue)) {
          const n = findNode(q.id);
          if (n && !n.item.adv) {
            n.item.adv = {};
          }
          if (n && n.item.adv) {
            if (q.tailwind !== n.item.adv.tailwind) {
              n.item.adv.tailwind = q.tailwind;
            }

            if (!q.prop_name) {
              n.item.adv.js = q.source;
              if (q.source_built !== null) {
                n.item.adv.jsBuilt = q.source_built;
              }
            } else {
              const comp = n.item.component;
              if (comp) {
                const [name, prop] =
                  Object.entries(comp.props).find(
                    ([name, prop]) => name === q.prop_name
                  ) || [];

                if (name && prop) {
                  prop.value = q.source;
                  prop.valueBuilt = (q.source_built || "").trim();
                }
              }
            }
          }
        }
      });
    }, 500);
  },
};
