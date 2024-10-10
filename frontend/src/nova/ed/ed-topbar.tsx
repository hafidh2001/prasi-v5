import { activateComp } from "crdt/load-comp-tree";
import set from "lodash.set";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightOpen,
} from "lucide-react";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { Tooltip } from "utils/ui/tooltip";

export const EdTopBar = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  const ui = {
    "ui.right.tab": p.ui.right.tab,
    "ui.popup.vars.id": p.ui.popup.vars.id,
    "ui.popup.events.open": p.ui.popup.events.open,
  };

  useEffect(() => {
    const last = p.nav.history[p.nav.cursor - 1] || {};
    if (last.comp_id !== active.comp?.id || last.item_id !== active.item_id) {
      if (p.nav.cursor < p.nav.history.length - 1) {
        p.nav.history = p.nav.history.slice(0, p.nav.cursor + 1);
      }
      p.nav.history.push({
        comp_id: active.comp?.id,
        item_id: active.item_id,
        ui,
      });
      p.nav.cursor = p.nav.history.length;
    } else {
      last.ui = ui;
    }
    p.render();
  }, [active.item_id, active.comp?.id, ...Object.values(ui)]);

  const can_next = p.nav.cursor <= p.nav.history.length - 1;
  const can_back = p.nav.cursor - 2 >= 0;
  return (
    <div
      className={cx(
        "min-h-[35px] h-[35px] border-b flex items-stretch text-[12px] justify-between "
      )}
    >
      <div className="flex items-stretch">
        <div
          className="flex items-center px-2 cursor-pointer hover:bg-blue-600 hover:text-white border-r"
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
        <div className="flex items-center">
          <Tooltip
            content="Previous item"
            className={cx(
              "cursor-pointer p-2 pr-1",
              can_back ? "hover:text-blue-600" : "text-slate-400"
            )}
            onClick={async () => {
              p.nav.navigating = true;
              const item = p.nav.history[p.nav.cursor - 2];
              if (item) {
                if (item.comp_id) {
                  activateComp(p, item.comp_id);
                } else if (active.comp) {
                  active.comp.destroy();
                  active.comp = null;
                }
                active.item_id = item.item_id;
                if (item.ui) {
                  for (const [k, v] of Object.entries(item.ui)) {
                    set(p, k, v);
                  }
                }

                p.nav.cursor--;
                p.render();
              }
            }}
          >
            <ChevronLeft size={20} />
          </Tooltip>
          <Tooltip
            content="Next item"
            className={cx(
              "cursor-pointer p-2 pl-1",
              can_next ? "hover:text-blue-600" : "text-slate-400"
            )}
            onClick={async () => {
              p.nav.navigating = true;
              const item = p.nav.history[p.nav.cursor];
              if (item) {
                if (item.comp_id) {
                  activateComp(p, item.comp_id);
                } else if (active.comp) {
                  active.comp.destroy();
                  active.comp = null;
                }

                if (item.ui) {
                  for (const [k, v] of Object.entries(item.ui)) {
                    set(p, k, v);
                  }
                }

                active.item_id = item.item_id;
                p.nav.cursor++;
                p.render();
              }
            }}
          >
            <ChevronRight size={20} />
          </Tooltip>
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
