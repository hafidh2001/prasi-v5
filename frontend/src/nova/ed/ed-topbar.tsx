import { EDGlobal } from "logic/ed-global";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useGlobal } from "utils/react/use-global";

export const EdTopBar = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  return (
    <div
      className={cx(
        "min-h-[35px] h-[35px] border-b flex p-1 items-stretch text-[12px] justify-between "
      )}
    >
      <div className="flex items-stretch">
        <div
          className="flex items-center m-1 cursor-pointer hover:text-blue-600"
          onClick={() => {
            if (!p.ui.panel.left) {
              p.ui.panel.left = true;
              localStorage.setItem("prasi-panel-left", "y");
            } else {
              p.ui.panel.left = false;
              localStorage.setItem("prasi-panel-left", "n");
            }
            p.render();
          }}
        >
          {p.ui.panel.left ? (
            <PanelLeftClose size={15} />
          ) : (
            <PanelLeftOpen size={15} />
          )}
        </div>
      </div>
      <div></div>
      <div className="flex flex-row-reverse items-stretch">
        {!p.ui.panel.right && (
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
            <PanelRightOpen size={15} />
          </div>
        )}
      </div>
    </div>
  );
};
