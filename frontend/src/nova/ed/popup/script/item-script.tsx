import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { Modal } from "utils/ui/modal";
import { closeEditor, EdScriptWorkbench } from "./code/workbench";

export const EdPopItemScript = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const popup = p.ui.popup.script;

  if (!popup.open) return null;

  const content = <EdScriptWorkbench></EdScriptWorkbench>;

  if (popup.paned) {
    return (
      <div className="relative bg-white flex flex-col flex-1">{content}</div>
    );
  }

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) {
          closeEditor(p);
        }
      }}
      fade={false}
    >
      <div
        ref={(ref) => {
          if (ref) {
            popup.ref = ref;
          }
        }}
        className={cx("absolute inset-[5%] bg-white flex flex-col")}
      >
        {content}
      </div>
    </Modal>
  );
};
