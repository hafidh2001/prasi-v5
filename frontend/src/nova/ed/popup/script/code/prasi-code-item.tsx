import { getActiveNode } from "crdt/node/get-node-by-id";
import { active, getActiveTree } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { codeUpdate } from "./prasi-code-update";
import { itemCssDefault } from "./js/default-val";
import { MonacoItemJS } from "./monaco-item-js";
import { MonacoRaw } from "./monaco-raw";
import { gzipSync } from "fflate";
import { encode } from "msgpackr";
export const EdPrasiCodeItem = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ id: "", ready: false, change_timeout: null as any });
  const node = getActiveNode(p);

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
            <MonacoItemJS
              onChange={({ model, value, editor }) => {
                if (model.id && model.source !== value) {
                  model.source = value;
                  model.exports = {};

                  codeUpdate.push(p, model.id, value, {
                    local_name: model.local?.name,
                    prop_name: model.prop_name,
                  });
                }
              }}
            />
          )}

          {mode === "css" && (
            <MonacoRaw
              value={_css}
              defaultValue={itemCssDefault}
              onChange={(val) => {
                getActiveTree(p).update(
                  "Update Code",
                  ({ findNode }) => {
                    const n = findNode(active.item_id);
                    if (n && !n.item.adv) {
                      n.item.adv = {};
                    }
                    if (n && n.item.adv) {
                      n.item.adv.css = val;
                    }
                  },
                  postCodeUpdateHistory(p, "css")
                );
              }}
              lang="scss"
            />
          )}

          {mode === "html" && (
            <MonacoRaw
              value={_html}
              onChange={(val) => {
                getActiveTree(p).update(
                  "Update Code",
                  ({ findNode }) => {
                    const n = findNode(active.item_id);
                    if (n && !n.item.adv) {
                      n.item.adv = {};
                    }
                    if (n && n.item.adv) {
                      n.item.adv.html = val;
                    }
                  },
                  postCodeUpdateHistory(p, "html")
                );
              }}
              lang="html"
            />
          )}
        </>
      )}
    </div>
  );
};

const postCodeUpdateHistory = (p: PG, type: "html" | "css") => {
  return ({ findNode }: any) => {
    const n = findNode(active.item_id);

    if (n) {
      _api.code_history(
        gzipSync(
          new Uint8Array(
            encode({
              mode: "update",
              site_id: p.site.id,
              selector: [
                {
                  comp_id: active.comp_id ? active.comp_id : undefined,
                  page_id: !active.comp_id ? p!.page.cur.id : undefined,
                  item_id: n.item.id,
                  type,
                  prop_name: "",
                },
              ],
            })
          )
        )
      );
    }
  };
};
