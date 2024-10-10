import { Tree as DNDTree } from "@minoru/react-dnd-treeview";
import { CompTree, loadCompTree } from "crdt/load-comp-tree";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { ErrorBox } from "../../vi/lib/error-box";
import { TopBtn } from "../ui/top-btn";
import { nodeRender } from "./parts/node/node-render";
import { treeCanDrop, treeOnDrop } from "./parts/on-drop";
import { doTreeSearch } from "./parts/search";
import { indentTree, useTreeIndent } from "./parts/use-indent";
import { DragPreview, Placeholder } from "./parts/drag-preview";
import { waitUntil } from "prasi-utils";

const t = { out: null as any };
export const EdCompTree: FC<{ tree: CompTree }> = ({ tree }) => {
  const p = useGlobal(EDGlobal, "EDITOR");

  useTreeIndent(p);

  const TypedTree = DNDTree<PNode>;

  let models = tree.nodes.models;
  if (p.ui.tree.search.value) {
    models = doTreeSearch(p);
  }

  return (
    <div className="flex-1 flex flex-col items-stretch">
      <div className="flex text-xs p-1 border-b bg-purple-100 items-stretch">
        <div className="flex flex-1 items-center">Component Edit</div>
        <TopBtn
          className="text-[11px] bg-white"
          onClick={async () => {
            if (active.comp) {
              active.comp.destroy();
              active.comp = null;
              if (p.ui.comp.last_edit_ids.length > 0 && p.sync) {
                const id = p.ui.comp.last_edit_ids.pop();
                if (id) {
                  active.comp = await loadCompTree({
                    sync: p.sync,
                    id: id,
                    async on_update(ctree) {
                      if (!p.comp.loaded[id]) {
                        await waitUntil(() => p.comp.loaded[id]);
                      }

                      p.comp.loaded[id].content_tree = ctree;
                      p.render();
                    },
                  });
                  p.ui.comp.loading_id = "";
                  p.render();
                }
              }

              p.render();
            }
          }}
        >
          Close
        </TopBtn>
      </div>
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
    </div>
  );
};
