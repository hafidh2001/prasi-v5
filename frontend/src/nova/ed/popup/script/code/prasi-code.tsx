import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useEffect, useRef } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { MonacoJS } from "./monaco-js";

export const EdPrasiCode = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ ready: false });
  const node = getActiveNode(p);

  const js = node?.item.adv?.js || "";

  useEffect(() => {
    local.ready = true;
    local.render();
  }, []);

  return (
    <div className={cx("w-full h-full")}>
      <MonacoJS
        value={js}
        onChange={(val) => {
          console.log(val);
        }}
      />
    </div>
  );
};
