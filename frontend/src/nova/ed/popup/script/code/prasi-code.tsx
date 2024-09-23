import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { jsOnChange } from "./js/on-change";
import { typingsItem } from "./js/typings-item";
import { MonacoJS } from "./monaco-js";

export const EdPrasiCode = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ id: "", ready: false, change_timeout: null as any });
  const node = getActiveNode(p);

  const js = node?.item.adv?.js || "";

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
              onChange={(val) => {
                jsOnChange(val, local, p, node!.item.id);
              }}
              models={{
                "file:///item.ts": typingsItem,
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
