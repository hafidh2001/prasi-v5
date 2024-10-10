import { Tree as DNDTree } from "@minoru/react-dnd-treeview";
import { PageTree } from "crdt/load-page-tree";
import { FC } from "react";
import { useGlobal } from "../../../utils/react/use-global";
import { ErrorBox } from "../../vi/lib/error-box";
import { EDGlobal } from "../logic/ed-global";
import { PNode } from "../logic/types";
import { DragPreview, Placeholder } from "./parts/drag-preview";
import { nodeRender } from "./parts/node/node-render";
import { treeCanDrop, treeOnDrop } from "./parts/on-drop";
import { doTreeSearch } from "./parts/search";
import { indentTree, useTreeIndent } from "./parts/use-indent";

const t = { out: null as any };
export const EdPageTree: FC<{ tree: PageTree }> = ({ tree }) => {
  const p = useGlobal(EDGlobal, "EDITOR");

  useTreeIndent(p);

  const TypedTree = DNDTree<PNode>;

  let models = tree.nodes.models;
  if (p.ui.tree.search.value) {
    models = doTreeSearch(p);
  }

  return (
    <div className={cx("flex flex-1 relative overflow-auto")}>
      <div className="absolute inset-0">
        <ErrorBox>
          <TypedTree
            tree={models}
            ref={(ref) => {
              if (!p.ui.tree.ref) {
                clearTimeout(t.out);
                t.out = setTimeout(() => {
                  if (
                    !document.activeElement?.classList.contains("tree-item")
                  ) {
                    indentTree(p);
                  }
                }, 10);
              }
              if (ref) {
                p.ui.tree.ref = ref;
              }
            }}
            rootId={"root"}
            render={nodeRender}
            canDrag={(node) => {
              if (node) {
                if (node.data?.parent?.component?.is_jsx_root) {
                  return false;
                }
              }

              return true;
            }}
            sort={false}
            insertDroppableFirst={false}
            dropTargetOffset={10}
            canDrop={(_, args) => {
              if (!args.dragSource?.data?.item) return false;
              return treeCanDrop(p, args);
            }}
            onDrop={(tree, options) => treeOnDrop(p, tree, options)}
            dragPreviewRender={DragPreview}
            placeholderRender={(node, params) => (
              <Placeholder node={node} params={params} />
            )}
          />
        </ErrorBox>
      </div>
    </div>
  );
};
