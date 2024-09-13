import { EdPageHistory } from "crdt/page-history";
import { useGlobal } from "../../utils/react/use-global";
import { Tooltip } from "../../utils/ui/tooltip";
import { EDGlobal } from "./logic/ed-global";
import { EdSitePicker } from "./popup/site/site-picker";
import { EdTree } from "./tree/ed-tree";
import {
  iconHistory,
  iconLogout,
  iconRebuildLarge,
  iconServer,
  iconVSCode,
} from "./ui/icons";
import { TopBtn } from "./ui/top-btn";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, getBackendOptions } from "@minoru/react-dnd-treeview";
import { useRef } from "react";
import { EdTreeSearch } from "./tree/parts/search";

export const EdLeft = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const ref_tree = useRef<HTMLDivElement>(null);
  return (
    <div className={cx("flex flex-1 flex-col relative border-r select-none")}>
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        <div
          className={cx(
            "h-[35px] border-b flex p-1 items-stretch text-[12px] justify-between",
            css`
              .btn {
                padding: 0px 5px;
                &:hover {
                  border-radius: 3px;
                  color: white;
                  cursor: pointer;
                }
              }
            `
          )}
        >
          <div className="flex items-stretch">
            <EdSitePicker />
            <Tooltip content="Logout" asChild>
              <div
                onClick={() => {
                  if (confirm("Logout ?")) {
                    location.href = "/logout";
                  }
                }}
                className="bg-slate-100 self-center hover:text-white cursor-pointer w-[22px] h-[22px] rounded-sm ml-1 transition-all flex items-center justify-center hover:bg-blue-600"
                dangerouslySetInnerHTML={{ __html: iconLogout }}
              ></div>
            </Tooltip>
          </div>

          <div className={cx("flex items-stretch")}>
            <Tooltip content="Rebuild" asChild>
              <div
                className="btn transition-all flex items-center justify-center hover:bg-blue-600"
                dangerouslySetInnerHTML={{ __html: iconRebuildLarge }}
              />
            </Tooltip>
            <Tooltip content="VSCode" asChild>
              <div
                className="btn transition-all flex items-center justify-center hover:bg-blue-600"
                dangerouslySetInnerHTML={{ __html: iconVSCode }}
              />
            </Tooltip>

            <Tooltip content="Deploy" asChild>
              <div
                className="btn transition-all flex items-center justify-center hover:bg-blue-600"
                dangerouslySetInnerHTML={{ __html: iconServer }}
              />
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-row items-stretch border-b">
          <Tooltip content="Page History" asChild>
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
                  <div className="text-sm flex-1">Page History</div>
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
          className="tree-body flex relative flex-1 overflow-y-auto overflow-x-hidden"
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          ref={ref_tree}
        >
          {p.page.tree && (
            <>
              {p.ui.left.mode === "tree" && (
                <>
                  {ref_tree.current && (
                    <DndProvider
                      backend={HTML5Backend}
                      options={getBackendOptions({
                        html5: {
                          rootElement: ref_tree.current,
                        },
                      })}
                    >
                      <EdTree tree={p.page.tree} />
                    </DndProvider>
                  )}
                </>
              )}
              {p.ui.left.mode === "history" && (
                <EdPageHistory tree={p.page.tree} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
