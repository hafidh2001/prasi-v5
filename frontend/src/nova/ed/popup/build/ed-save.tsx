import { EDGlobal } from "logic/ed-global";
import { Check, CheckCheck, Save, Unplug, Zap } from "lucide-react";
import { useGlobal } from "utils/react/use-global";

export const EdSave = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  return (
    <>
      {p.sync?.ws.readyState !== WebSocket.OPEN ? (
        <>
          <div
            className={cx("flex items-center relative", "text-white space-x-1")}
          >
            <div className="border border-white text-[10px] font-mono px-1 rounded-sm flex items-center space-x-1">
              <Unplug size={10} /> <div>Connection Loss</div>
            </div>
            <div>Retrying...</div>
          </div>
        </>
      ) : (
        <>
          {p.ui.topbar.reconnected ? (
            <div className={cx("flex items-center relative", "text-green-700")}>
              <div className="absolute flex items-center ml-1">
                <div className="rounded-md px-[2px] bg-white">
                  <Zap size={15} className="text-green-700" />
                </div>
                <div className={cx("text-[12px]")}>Reconnected!</div>
              </div>
            </div>
          ) : (
            <>
              {p.ui.page.saving && (
                <div
                  className={cx(
                    "flex items-center relative",
                    !p.ui.page.saved ? "text-purple-600" : "text-green-700"
                  )}
                >
                  <div className="absolute flex items-center ml-1">
                    <Save
                      size={12}
                      strokeWidth={1.5}
                      className={cx(
                        "mr-1",
                        !p.ui.page.saved ? "animate-pulse duration-500" : ""
                      )}
                    />
                    {p.ui.page.saved && (
                      <div className="-ml-[10px] rounded-md -mb-2 px-[2px] bg-white">
                        <CheckCheck
                          size={11}
                          strokeWidth={3}
                          className="text-green-700"
                        />
                      </div>
                    )}
                    <div className={cx("text-[9px]")}>
                      {p.ui.page.saved ? "Saved" : "Saving..."}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
