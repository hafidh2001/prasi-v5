import { DndProvider, getBackendOptions } from "@minoru/react-dnd-treeview";
import { EdTreeHistory } from "crdt/tree-history";
import { TreeDeciduous } from "lucide-react";
import { useRef } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Loading } from "utils/ui/loading";
import { useGlobal } from "../../../../utils/react/use-global";
import { Tooltip } from "../../../../utils/ui/tooltip";
import { active } from "../../logic/active";
import { EDGlobal } from "../../logic/ed-global";
import { iconHistory } from "../../ui/icons";
import { TopBtn } from "../../ui/top-btn";
import { EdCompTree } from "./tree/ed-comp-tree";
import { EdPageTree } from "./tree/ed-page-tree";
import { EdTreeSearch } from "./tree/parts/search";
import { EdTreeTopBar } from "./tree/parts/tree-top-bar";

export const EdLeft = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const ref_tree = useRef<HTMLDivElement>(null);

  return (
    <div className={cx("flex flex-1 flex-col relative border-r select-none")}>
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        {p.status === "page-not-found" ? (
          <div className="flex items-center justify-center flex-1 text-sm">
            <TreeDeciduous size={40} strokeWidth={1} className="mr-1" />
            <div>No Tree Here</div>
          </div>
        ) : (
          <>
            <div className="flex flex-row items-stretch border-b">
              <Tooltip
                content={active.comp ? "Component History" : "Page History"}
                asChild
              >
                <div
                  className={cx(
                    "flex items-center",
                    p.ui.left.mode === "history" &&
                      "border-blue-600 border-l-4 bg-blue-50 flex-1"
                  )}
                >
                  <div
                    className={cx(
                      "btn transition-all flex items-center justify-center cursor-pointer",
                      p.ui.left.mode === "tree" &&
                        "hover:bg-blue-600 hover:text-white  border-r",
                      css`
                        width: 25px;
                        height: 25px;
                      `
                    )}
                    onClick={() => {
                      p.ui.left.mode =
                        p.ui.left.mode === "tree" ? "history" : "tree";
                      p.render();
                    }}
                    dangerouslySetInnerHTML={{ __html: iconHistory }}
                  />
                  {p.ui.left.mode === "history" && (
                    <>
                      <div className="text-sm flex-1">
                        {active.comp ? "Component History" : "Page History"}
                      </div>
                      <div>
                        <TopBtn
                          className="text-[11px] bg-white mr-1"
                          onClick={() => {
                            p.ui.left.mode =
                              p.ui.left.mode === "tree" ? "history" : "tree";
                            p.render();
                          }}
                        >
                          Close
                        </TopBtn>
                      </div>
                    </>
                  )}
                </div>
              </Tooltip>
              {p.ui.left.mode === "tree" && <EdTreeSearch />}
            </div>

            <div
              className={cx(
                "tree-body flex relative flex-1 flex-col items-stretch overflow-y-auto overflow-x-hidden",
                css`
                  .absolute > ul {
                    position: absolute;
                    inset: 0;
                  }
                `
              )}
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              ref={ref_tree}
            >
              {!p.page.tree || (active.comp_id && !active.comp) ? (
                <Loading backdrop={false} note="loading-tree" />
              ) : (
                <>
                  {p.ui.left.mode === "tree" && (
                    <>
                      <EdTreeTopBar />
                      {ref_tree.current && (
                        <DndProvider
                          backend={HTML5Backend}
                          options={getBackendOptions({
                            html5: {
                              rootElement: ref_tree.current,
                            },
                          })}
                        >
                          {active.comp ? (
                            <EdCompTree tree={active.comp} />
                          ) : (
                            <EdPageTree tree={p.page.tree} />
                          )}
                        </DndProvider>
                      )}
                    </>
                  )}
                  {p.ui.left.mode === "history" && (
                    <EdTreeHistory
                      tree={active.comp ? active.comp : p.page.tree}
                    />
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
