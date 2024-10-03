import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useGlobal } from "utils/react/use-global";

export const EdRight = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  return (
    <>
      <div
        className="flex items-center m-1 cursor-pointer hover:text-blue-600"
        onClick={() => {
          if (!p.ui.panel.right) {
            p.ui.panel.right = true;
            localStorage.setItem("prasi-panel-right", "y");
          } else {
            p.ui.panel.right = false;
            localStorage.setItem("prasi-panel-right", "n");
          }
          p.render();
        }}
      >
        {p.ui.panel.right ? (
          <PanelRightClose size={15} />
        ) : (
          <PanelRightOpen size={15} />
        )}
      </div>

      <div className="relative flex-1 overflow-auto">
        <code className="monospace whitespace-pre-wrap text-[8px] absolute inset-0">
          {getActiveNode(p)?.item.adv?.jsBuilt}
        </code>
      </div>
    </>
  );
};
