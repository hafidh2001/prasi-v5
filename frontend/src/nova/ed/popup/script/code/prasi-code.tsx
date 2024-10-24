import { getActiveNode } from "crdt/node/get-node-by-id";
import { active, getActiveTree } from "logic/active";
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

  let mode = ["js", "css", "html"].includes(p.ui.popup.script.mode)
    ? p.ui.popup.script.mode
    : "js";

  const has_expression = !!node?.item.content || !!node?.item.loop;
  if (has_expression) {
    mode = "css";
  }

  const id = node?.item.id || "";

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
      {local.ready && (
        <>
          {mode === "js" && (
            <MonacoJS
              highlightJsx
              models={[]}
              onReloadModels={async () => {
                const tree = getActiveTree(p);
                await tree.reloadScriptModels();

                const models = tree.script_models;
                const model = models[id];
                if (model && !model.source) {
                  model.extracted_content = itemJsDefault;
                  model.source = await jscript.prettier.format(
                    migrateCode(model, models)
                  );
                }

                return [
                  {
                    name: "file:///typings-item.ts",
                    source: typingsItem,
                  },
                  ...Object.values(tree.script_models),
                ];
              }}
              onChange={({ model, value, editor }) => {
                if (model.id && model.source !== value) {
                  model.source = value;
                  model.exports = {};

                  update.push(p, model.id, value, {
                    local_name: model.local?.name,
                    prop_name: model.prop_name,
                  });
                }
              }}
              activeModel={`file:///${active.item_id}.tsx`}
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
