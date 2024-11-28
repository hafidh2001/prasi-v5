import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";

export const DebugPopup = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  return (
    <div className="fixed z-40 w-full h-full inset-0 bg-slate-100 flex items-center justify-center">
      <div className="w-[90%] h-[90%] bg-white flex flex-col border border-black">
        <div className="p-1 border-b border-black select-none">Prasi Log</div>
        <div className="flex-1 overflow-auto relative">
          <div
            className={cx(
              "absolute inset-0 px-3 py-1 text-sm",
              css`
                font-family: "Liga Menlo", monospace;
                white-space: pre-wrap;
              `
            )}
          >
            {p.ui.site.build_log.join("\n")}
          </div>
        </div>
      </div>
    </div>
  );
};
