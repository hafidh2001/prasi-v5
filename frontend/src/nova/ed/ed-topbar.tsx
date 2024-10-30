import { activateComp } from "crdt/load-comp-tree";
import set from "lodash.set";
import { active } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import { PanelLeftClose, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { Tooltip } from "utils/ui/tooltip";

export const navPrevItem = (p: PG) => {
  p.nav.navigating = true;
  const item = p.nav.history[p.nav.cursor - 2];
  if (item) {
    if (item.comp_id) {
      if (item.comp_id !== active.comp_id) {
        activateComp(p, item.comp_id);
      }
    } else if (active.comp) {
      active.comp.destroy();
      active.comp_id = "";
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
};

export const navNextItem = (p: PG) => {
  p.nav.navigating = true;
  const item = p.nav.history[p.nav.cursor];
  if (item) {
    if (item.comp_id) {
      if (item.comp_id !== active.comp_id) {
        activateComp(p, item.comp_id);
      }
    } else if (active.comp) {
      active.comp.destroy();
      active.comp_id = "";
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
};

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
            content={
              <div className="flex items-center space-x-2">
                <div>Previous item</div>{" "}
                <div className="border border-slate-600 border-b-2 px-1 rounded-sm">
                  Ctrl + &mdash;
                </div>
              </div>
            }
            className={cx(
              "cursor-pointer pl-2",
              can_back ? "hover:text-blue-600" : "text-slate-400"
            )}
            onClick={async () => {
              navPrevItem(p);
            }}
          >
            <TriangleIcon />
          </Tooltip>
          <Tooltip
            content={
              <div className="flex items-center space-x-2">
                <div>Next item</div>{" "}
                <div className="border border-slate-600 border-b-2 px-1 rounded-sm">
                  Ctrl + =
                </div>
              </div>
            }
            className={cx(
              "cursor-pointer rotate-180",
              can_next ? "hover:text-blue-600" : "text-slate-400"
            )}
            onClick={async () => {
              navNextItem(p);
            }}
          >
            <TriangleIcon />
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

const TriangleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.295 4.177a.73.73 0 011.205.552v6.542a.73.73 0 01-1.205.552L5.786 8.8a1 1 0 01-.347-.757v-.084a1 1 0 01.347-.757z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
