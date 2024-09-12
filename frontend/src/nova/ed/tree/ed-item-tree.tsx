import { pageTree } from "crdt/page-tree";
import { useGlobal } from "../../../utils/react/use-global";
import { EDGlobal } from "../logic/ed-global";

export const EdItemTree = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  const id = p.page.tree?.watch((s) => s.id);

  return (
    <div className={cx("flex flex-1 relative overflow-auto")}>
      <div
        className="absolute inset-0"
        onClick={() => {
          p.page.tree?.update((s) => {
            s.id = "momo" + Date.now();
          });
        }}
      >
        {id}
      </div>
    </div>
  );
};
