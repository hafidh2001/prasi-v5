import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { jscript } from "utils/script/jscript";
import { Loading } from "utils/ui/loading";
import { Modal } from "utils/ui/modal";
import { PrasiFlow } from "./flow/prasi-flow";
import { EdScriptWorkbench } from "./parts/workbench";
import { useEffect } from "react";

export const EdPopItemScript = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  const popup = p.ui.popup.script;

  if (!popup.open) return null;

  useEffect(() => {
    if (!jscript.editor) {
      const ival = setInterval(() => {
        if (jscript.editor) {
          p.render();
          clearInterval(ival);
        }
      }, 100);
    }
  }, [jscript.editor]);

  const content = (
    <>
      {!jscript.editor && <Loading note={"js-editor"} backdrop={false} />}
      {jscript.editor && (
        <>
          <EdScriptWorkbench>
            {({ mode }) => (
              <>
                {popup.mode === "js" && (
                  <>{mode === "flow" ? <PrasiFlow /> : <></>}</>
                )}
              </>
            )}
          </EdScriptWorkbench>
        </>
      )}
    </>
  );

  if (popup.paned)
    return (
      <div className="w-full h-full bg-white flex flex-col flex-1">
        {content}
      </div>
    );

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) {
          popup.open = false;
          p.render();
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
