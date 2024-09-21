import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useEffect, useRef } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";

export const EdPrasiMonaco = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ ready: false });
  const node = getActiveNode(p);
  const ed_ref = useRef<HTMLDivElement>(null);

  const js = node?.item.adv?.js || "";

  useEffect(() => {
    if (ed_ref.current) {
    }
    local.ready = true;
    local.render();
  }, []);

  return <div className={cx("w-full h-full")} ref={ed_ref}></div>;
};
