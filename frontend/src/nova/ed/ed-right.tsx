import { getActiveNode } from "crdt/node/get-node-by-id";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import {
  AudioWaveform,
  Library,
  PanelRightClose,
  PanelRightOpen,
  SquareChartGantt,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useGlobal } from "utils/react/use-global";
import { EdVarList } from "./popup/vars/ed-var-list";
import { EdEvents } from "./right/events/ed-events";
import { EdCompTitle } from "./right/comp/ed-comp-title";
import { EdCompProp } from "./right/comp/ed-comp-prop";
import { EdStyleAll } from "./right/style/side-all";

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
        {is_comp && <EdCompTitle />}
        {!is_comp && (
          <div className="flex justify-between items-stretch flex-1">
            <div className="flex items-end pt-2 flex-1">
              {[
                "style",
                // , "events", "vars"
              ].map((tab) => {
                return (
                  <div
                    className={cx(
                      "px-2 flex items-center h-[27px] border cursor-pointer hover:text-blue-600 border-b-0 text-xs -mb-[1px] capitalize rounded-t-sm",
                      p.ui.right.tab === tab
                        ? "bg-white"
                        : "border-transparent",
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
                      p.ui.right.tab = tab as any;
                      p.render();
                    }}
                    key={tab}
                  >
                    {tab === "style" && (
                      <>
                        <SquareChartGantt />
                        Style
                      </>
                    )}
                    {/* {tab === "events" && (
                    <>
                      <AudioWaveform />
                      Events
                    </>
                  )}
                  {tab === "vars" && (
                    <>
                      <Library />
                      Variables
                    </>
                  )} */}
                  </div>
                );
              })}
            </div>

            <div className="pr-2 flex items-center">
              <div
                className={cx(
                  "flex items-center font-mono text-[8px] space-x-1 border rounded-sm cursor-pointer",
                  p.ui.page.ruler
                    ? "border-green-800 text-green-800"
                    : "border-slate-400 text-slate-600",
                  css`
                    padding-left: 5px;
                    .on-off {
                      padding: 0px 5px;
                      width: 25px;
                      text-align: center;
                    }
                  `
                )}
                onClick={() => {
                  p.ui.page.ruler = !p.ui.page.ruler;
                  p.render();
                }}
              >
                <div>Ruler</div>
                {p.ui.page.ruler ? (
                  <div className="bg-green-800 text-white on-off">ON</div>
                ) : (
                  <div className="bg-slate-600 text-white on-off">OFF</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex-1 overflow-auto">
        <div className="absolute inset-0">
          {!is_comp && (
            <>
              {p.ui.right.tab === "style" && <EdStyleAll />}
              {/* {p.ui.right.tab === "events" && <EdEvents />}
              {p.ui.right.tab === "vars" && <EdVarList />} */}
            </>
          )}
          {is_comp && <EdCompProp />}
        </div>
        {/* <code className="monospace whitespace-pre-wrap text-[8px] absolute inset-0">
          {getActiveNode(p)?.item.adv?.jsBuilt}
        </code> */}
      </div>
    </>
  );
};
