import { getActiveNode } from "crdt/node/get-node-by-id";
import { getActiveTree } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import { waitUntil } from "prasi-utils";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { cutCode, jscript } from "utils/script/jscript";
import { itemCssDefault, itemJsDefault } from "./js/default-val";
import { migrateCode } from "./js/migrate-code";
import { replaceString } from "./js/replace-string";
import { typingsItem } from "./js/typings-item";
import { MonacoJS } from "./monaco-js";
import { MonacoLang } from "./monaco-lang";

export const EdPrasiCode = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ id: "", ready: false, change_timeout: null as any });
  const node = getActiveNode(p);

  const _js = node?.item.adv?.js || "";
  const _css = node?.item.adv?.css || "";
  const _html = node?.item.adv?.html || "";

  useEffect(() => {
    if (!local.ready) {
      local.ready = true;
      local.render();
    }
  }, [local.id]);

  if (node?.item.id !== local.id) {
    local.id = node?.item.id || "";
    local.ready = false;
  }

  const mode = p.ui.popup.script.mode;

  const id = node?.item.id || "";
  const models = getActiveTree(p).script_models;
  const model = models[id];

  if (model && !model.source) {
    model.extracted_content = itemJsDefault;
    jscript.prettier.format(migrateCode(model, models)).then((formatted) => {
      model.source = formatted;
      local.render();
    });
  }

  return (
    <div
      className={cx(
        "w-full h-full",
        css`
          .margin-view-overlays {
            padding-left: 3px;
          }
        `
      )}
    >
      {local.ready && model && model.source && (
        <>
          {mode === "js" && (
            <MonacoJS
              highlightJsx
              models={[
                {
                  name: "file:///typings-item.ts",
                  source: typingsItem,
                },
                ...Object.values(models),
              ]}
              onReloadModels={async () => {
                const tree = getActiveTree(p);
                await tree.reloadScriptModels();
                return [
                  {
                    name: "file:///typings-item.ts",
                    source: typingsItem,
                  },
                  ...Object.values(tree.script_models),
                ];
              }}
              onChange={({ model, value, editor, monaco }) => {
                if (model.id) {
                  model.source = value;
                  model.exports = {};

                  // clearTimeout(local.change_timeout);
                  // local.change_timeout = setTimeout(() => {
                  //   const markers = monaco.editor.getModelMarkers({
                  //     owner: "typescript",
                  //   });
                  //   if (markers.length === 0) {
                  //     parseItemCode(model as any);
                  //     model.source = migrateCode(model as any, models);

                  //     if (model.model) {
                  //       const vstate = editor.saveViewState();
                  //       model.model._ignoreChanges = true;
                  //       model.model.applyEdits([
                  //         {
                  //           text: model.source,
                  //           range: model.model.getFullModelRange(),
                  //         },
                  //       ]);
                  //       editor.restoreViewState(
                  //         foldRegionVState(
                  //           model.model.getLinesContent(),
                  //           vstate
                  //         )
                  //       );
                  //     }
                  //   }
                  // }, 2000);

                  update.push(p, model.id, value);
                }
              }}
              activeModel={model.name}
            />
          )}

          {mode === "css" && (
            <MonacoLang
              value={_css}
              defaultValue={itemCssDefault}
              onChange={(val) => {
                console.log(val);
              }}
              lang="scss"
            />
          )}

          {mode === "html" && (
            <MonacoLang
              value={_html}
              onChange={(val) => {
                console.log(val);
              }}
              lang="html"
            />
          )}
        </>
      )}
    </div>
  );
};

const update = {
  p: null as any,
  timeout: null as any,
  queue: {} as Record<
    string,
    {
      id: string;
      source: string;
      prop_name?: string;
      source_built?: string | null;
    }
  >,
  push(p: PG, id: string, source: string, prop_name?: string) {
    this.p = p;
    this.queue[id] = { id, source, prop_name };
    this.execute();
  },
  execute() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      if (!jscript.loaded) {
        await waitUntil(() => jscript.loaded);
      }

      for (const q of Object.values(this.queue)) {
        q.source_built = null;
        try {
          if (!q.source.trim()) {
            q.source_built = undefined;
            continue;
          }
          const lines = q.source.split("\n").map((e) => {
            if (e.startsWith("export const")) {
              return e.replace("export const", "const");
            }
            return e;
          });

          let source = "";
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("// #endregion")) {
              source = lines.slice(i).join("\n");
              break;
            }
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

          const replaced = replaceString(source, [replace]);
          if (replaced.trim()) {
            try {
              q.source_built = (
                await jscript.transform?.(replaced, {
                  jsx: "transform",
                  format: "cjs",
                  logLevel: "silent",
                  loader: "tsx",
                })
              )?.code;
            } catch (e) {
              console.log(replaced, e, q);
            }
          } else {
            q.source_built = undefined;
          }
        } catch (e) {
          console.error(e);
        }
      }

      getActiveTree(this.p).update("Update Code", ({ findNode }) => {
        for (const q of Object.values(this.queue)) {
          const n = findNode(q.id);
          if (n && n.item.adv && !n.item.component?.id) {
            if (!q.prop_name) {
              n.item.adv.js = q.source;
              if (q.source_built !== null) {
                n.item.adv.jsBuilt = q.source_built;
              }
            }
          }
        }
      });
    }, 500);
  },
};
