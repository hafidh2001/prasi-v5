import { Tree as DNDTree } from "@minoru/react-dnd-treeview";
import { PageTree } from "crdt/page-tree";
import { FC } from "react";
import { useGlobal } from "../../../utils/react/use-global";
import { ErrorBox } from "../../vi/lib/error-box";
import { EDGlobal } from "../logic/ed-global";
import { PNode } from "../logic/types";
import { treeOnDrop } from "./parts/on-drop";
import { nodeRender } from "./parts/node/node-render";
import { useTreeIndent } from "./parts/use-indent";

export const EdTree: FC<{ tree: PageTree }> = ({ tree }) => {
  const p = useGlobal(EDGlobal, "EDITOR");

  useTreeIndent(p);

  const TypedTree = DNDTree<PNode>;

  return (
    <div className={cx("flex flex-1 relative overflow-auto")}>
      <div className="absolute inset-0">
        <ErrorBox>
          <TypedTree
            onDrop={treeOnDrop}
            tree={tree.nodes.models}
            ref={(ref) => {
              p.ui.tree.ref = ref;
            }}
            rootId={"root"}
            render={nodeRender}
          />
        </ErrorBox>
      </div>
    </div>
  );
};
