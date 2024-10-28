import { EDGlobal } from "logic/ed-global";
import { PanelTopClose, PictureInPicture2, X } from "lucide-react";
import { useGlobal } from "utils/react/use-global";
import { Tooltip } from "utils/ui/tooltip";
import { closeEditor } from "../code/workbench";

export const EdWorkbenchPaneAction = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const popup = p.ui.popup.script;

  return (
    <div className="flex items-stretch text-xs">
      {!popup.paned && (
        <Tooltip content="Switch to Panned Mode" asChild>
          <div
            onClick={() => {
              localStorage.setItem("prasi-popup-script-mode", "paned");
              popup.paned = true;
              p.render();
            }}
            className="flex items-center justify-center px-2 cursor-pointer hover:text-blue-600"
          >
            <PanelTopClose size={13} />
          </div>
        </Tooltip>
      )}
      {popup.paned && (
        <Tooltip content="Switch to Popup Mode" asChild>
          <div
            onClick={() => {
              localStorage.setItem("prasi-popup-script-mode", "popup");
              popup.paned = false;
              p.render();
            }}
            className="flex items-center justify-center px-2 cursor-pointer hover:text-blue-600"
          >
            <PictureInPicture2 size={13} />
          </div>
        </Tooltip>
      )}
      <div
        onClick={() => {
          closeEditor(p)
        }}
        className="flex items-center justify-center px-1 pr-2 cursor-pointer hover:text-red-600"
      >
        <X size={13} />
      </div>
    </div>
  );
};
