import { useEffect } from "react";
import { useGlobal } from "../../../utils/react/use-global";
import { pageTree } from "../crdt/page-tree";
import { EDGlobal } from "../logic/ed-global";

export const EdItemTree = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  useEffect(() => {
    if (p.page.cur) {
      pageTree(p.page.cur.content_tree);
    }
  }, []);

  return (
    <div className={cx("flex flex-1 relative overflow-auto")}>
      <div className="absolute inset-0">"asd"</div>
    </div>
  );
};
