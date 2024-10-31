import { PanelLeftClose } from "lucide-react";
import { FC } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLocal } from "utils/react/use-local";
import { EdCodeFindAllPane } from "./parts/ed-find-all-pane";

export const EdWorkbenchBody: FC<{
  side_open: boolean;
  children: any;
  onSideClose: () => void;
}> = ({ side_open: side, children, onSideClose: onClose }) => {
  const local = useLocal({
    size: (Number(localStorage.getItem("prasi-workbench-size")) ||
      30) as number,
    active_tab: "Find All",
  });
  if (!side) {
    return children;
  }

  return (
    <PanelGroup direction="horizontal">
      <Panel
        defaultSize={local.size}
        minSize={10}
        maxSize={80}
        onResize={(e) => {
          local.size = e;
          localStorage.setItem("prasi-workbench-size", e.toString());
          local.render();
        }}
        className="flex border-r flex-col"
      >
        <div className="flex items-end pt-1 bg-slate-100 pl-1 border-b">
          <div className="flex items-center flex-1">
            {["Find All", "Template Fields"].map((tab) => {
              let is_active = tab === local.active_tab;
              return (
                <div
                  className={cx(
                    "px-2 flex items-center h-[27px] border cursor-pointer hover:text-blue-600 border-b-0 text-xs -mb-[1px] capitalize rounded-t-sm whitespace-nowrap",
                    is_active ? "bg-white" : "border-transparent",
                    css`
                      svg {
                        width: 12px;
                        height: 12px;
                        margin-right: 3px;
                      }
                    `
                  )}
                  onClick={() => {
                    local.active_tab = tab;
                    local.render();
                  }}
                  key={tab}
                >
                  {tab}
                </div>
              );
            })}
          </div>
          <div
            className="flex self-stretch items-center px-2 cursor-pointer hover:text-blue-600"
            onClick={() => {
              onClose();
            }}
          >
            <PanelLeftClose size={15} />
          </div>
        </div>
        <div className="flex-1 relative overflow-auto">
          <div className="absolute inset-0">
            {local.active_tab === "Find All" && <EdCodeFindAllPane />}
          </div>
        </div>
      </Panel>
      <PanelResizeHandle></PanelResizeHandle>
      <Panel className="flex">{children}</Panel>
    </PanelGroup>
  );
};
