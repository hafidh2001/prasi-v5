import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import {
  AudioWaveform,
  BookAudio,
  Library,
  PanelRightClose,
  PanelRightOpen,
  RectangleEllipsis,
  SquareChartGantt,
  Variable,
} from "lucide-react";
import { useGlobal } from "utils/react/use-global";
import { EdEvents } from "./attrs/events/ed-events";
import { active } from "logic/active";

export const EdRight = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  const node = getActiveNode(p);
  let is_comp = !!node?.item.component?.id;
  if (active.comp?.id === node?.item.component?.id) {
    is_comp = false;
  }
  return (
    <>
      <div className="flex border-b h-[30px] items-stretch bg-slate-100 select-none">
        <div
          className="flex items-center px-2 pt-1 cursor-pointer hover:text-blue-600"
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

        {!is_comp && (
          <div className="flex items-end pt-2">
            {["style", "events", "vars"].map((tab) => {
              return (
                <div
                  className={cx(
                    "px-2 flex items-center h-[27px] border cursor-pointer hover:text-blue-600 border-b-0 text-xs -mb-[1px] capitalize rounded-t-sm",
                    p.ui.right.tab === tab ? "bg-white" : "border-transparent",
                    css`
                      svg {
                        width: 12px;
                        height: 12px;
                        margin-right: 3px;
                      }
                    `
                  )}
                  onClick={() => {
                    localStorage.setItem("prasi-panel-right-tab", tab);
                    p.ui.right.tab = tab;
                    p.render();
                  }}
                  key={tab}
                >
                  {tab === "style" && <SquareChartGantt />}
                  {tab === "events" && <AudioWaveform />}
                  {tab === "vars" && <Library />}
                  <div>{tab}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative flex-1 overflow-auto">
        {!is_comp && (
          <div className="absolute inset-0">
            {p.ui.right.tab === "events" && <EdEvents />}
          </div>
        )}
        {/* <code className="monospace whitespace-pre-wrap text-[8px] absolute inset-0">
          {getActiveNode(p)?.item.adv?.jsBuilt}
        </code> */}
      </div>
    </>
  );
};
