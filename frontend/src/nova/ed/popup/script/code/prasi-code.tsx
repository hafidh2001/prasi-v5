import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { MonacoJS } from "./monaco-js";
import { typingsItem } from "./js/typings-item";
import { jscript } from "utils/script/jscript";
import { getActiveTree } from "logic/active";

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

  return (
    <div className={cx("w-full h-full")}>
      {local.ready && (
        <MonacoJS
          value={js}
          enableJsx
          onChange={(val) => {
            clearTimeout(local.change_timeout);
            local.change_timeout = setTimeout(async () => {
              const transform = jscript.transform!;
              if (!p.ui.popup.script.prop_name) {
                const res = await transform(`render(${val})`, {
                  jsx: "transform",
                  logLevel: "silent",
                  format: "cjs",
                  loader: "tsx",
                });
                getActiveTree(p).update(
                  "Update item script",
                  ({ findNode }) => {
                    const n = findNode(node!.item.id);
                    if (n && n.item) {
                      if (!n.item.adv) {
                        n.item.adv = {};
                      }

                      n.item.adv.js = val;
                      n.item.adv.jsBuilt = res.code;
                    }
                  }
                );
              }
            }, 300);
          }}
          models={{
            "file:///item.ts": typingsItem,
          }}
        />
      )}
    </div>
  );
};
