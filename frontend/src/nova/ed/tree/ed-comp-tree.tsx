import { Tree as DNDTree } from "@minoru/react-dnd-treeview";
import { CompTree, loadCompTree } from "crdt/load-comp-tree";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import { ArrowLeft, Box, Copy, LayoutList, ListTree, X } from "lucide-react";
import { waitUntil } from "prasi-utils";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { ErrorBox } from "../../vi/lib/error-box";
import { TopBtn } from "../ui/top-btn";
import { EdMasterProp } from "./master-prop/ed-master-prop";
import { DragPreview, Placeholder } from "./parts/drag-preview";
import { nodeRender } from "./parts/node/node-render";
import { treeCanDrop, treeOnDrop } from "./parts/on-drop";
import { doTreeSearch } from "./parts/search";
import { indentTree, useTreeIndent } from "./parts/use-indent";

const t = { out: null as any };
export const EdCompTree: FC<{ tree: CompTree }> = ({ tree }) => {
  const p = useGlobal(EDGlobal, "EDITOR");

  useTreeIndent(p);

  const TypedTree = DNDTree<PNode>;

  let models = tree.nodes.models;
  if (p.ui.tree.search.value) {
    models = doTreeSearch(p);
  }
  const comp = p.comp.loaded[active.comp_id];

  return (
    <div
      className={cx(
        "flex-1 flex flex-col items-stretch border-2 border-purple-600",
        css`
          .top-btn {
            border-radius: 3px;
          }
        `
      )}
    >
      <div className="flex text-xs p-1 justify-between text-white bg-purple-600 items-center">
        <div className="flex items-center">
          <Box size={10} className="mr-1" />
          {comp?.content_tree?.name}
        </div>
        <div
          className="flex items-center hover:bg-white hover:text-black rounded-[3px] px-1 cursor-pointer"
          onClick={async () => {
            if (active.comp) {
              active.comp.destroy();
              active.comp = null;
              active.comp_id = "";
              if (p.ui.comp.last_edit_ids.length > 0 && p.sync) {
                const id = p.ui.comp.last_edit_ids.pop();
                if (id) {
                  active.comp = await loadCompTree({
                    sync: p.sync,
                    id: id,
                    p,
                    async on_update(ctree) {
                      if (!p.comp.loaded[id]) {
                        await waitUntil(() => p.comp.loaded[id]);
                      }

                      if (p.viref.resetCompInstance)
                        p.viref.resetCompInstance(id);
                      p.comp.loaded[id].content_tree = ctree;
                      p.render();
                      p.ui.editor.render();
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
          <X size={12} className="mr-1" />
          Close
        </div>
      </div>
      <div className="flex text-xs px-1 justify-between pt-1 bg-purple-600 items-stretch">
        <div className="flex items-end cursor-pointer">
          <div
            className={cx(
              "flex items-center p-1 px-2 rounded-t-[2px]",
              p.ui.tree.comp.master_prop === "n"
                ? active.item_id === comp.content_tree.id
                  ? "bg-blue-500 text-white"
                  : "bg-white"
                : "text-white bg-purple-500"
            )}
            onClick={() => {
              p.ui.tree.comp.master_prop = "n";
              p.render();
            }}
          >
            <ListTree size={12} className="mr-1" />
            <div>Edit Tree </div>
          </div>
          <div
            className={cx(
              "flex items-center p-1 px-2 rounded-t-[2px]",
              p.ui.tree.comp.master_prop === "y"
                ? "bg-purple-100"
                : "text-white"
            )}
            onClick={() => {
              p.ui.tree.comp.master_prop = "y";
              p.render();
            }}
          >
            <LayoutList size={12} className="mr-1" />
            <div>Edit Master Props</div>
          </div>
        </div>
      </div>
      {p.ui.tree.comp.master_prop === "y" ? (
        <EdMasterProp />
      ) : (
        <div className={cx("flex flex-1 relative overflow-auto")}>
          <div className="absolute inset-0">
            <ErrorBox>
              <TypedTree
                tree={models}
                ref={(ref) => {
                  if (!p.ui.tree.ref) {
                    waitUntil(async () => {
                      return document.querySelector(".tree-item");
                    }).then(() => {
                      indentTree(p);
                    });
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
      )}
    </div>
  );
};
