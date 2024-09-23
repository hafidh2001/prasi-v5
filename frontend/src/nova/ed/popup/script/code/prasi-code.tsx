import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { itemCssDefault, itemJsDefault } from "./default-val";
import { jsOnChange } from "./js/on-change";
import { typingsItem } from "./js/typings-item";
import { MonacoJS } from "./monaco-js";
import { MonacoLang } from "./monaco-lang";

export const EdPrasiCode = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ id: "", ready: false, change_timeout: null as any });
  const node = getActiveNode(p);

  const js = node?.item.adv?.js || "";
  const css = node?.item.adv?.css || "";
  const html = node?.item.adv?.html || "";

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

  return (
    <div className={cx("w-full h-full")}>
      {local.ready && (
        <>
          {mode === "js" && (
            <MonacoJS
              value={js}
              enableJsx
              defaultValue={itemJsDefault}
              onChange={(val) => {
                jsOnChange(val, local, p, node!.item.id);
              }}
              models={{
                "file:///item.ts": typingsItem,
              }}
            />
          )}

          {mode === "css" && (
            <MonacoLang
              value={css}
              defaultValue={itemCssDefault}
              onChange={(val) => {
                console.log(val);
              }}
              lang="scss"
            />
          )}

          {mode === "html" && (
            <MonacoLang
              value={html}
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
