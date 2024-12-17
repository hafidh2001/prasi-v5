import { activateComp } from "crdt/load-comp-tree";
import set from "lodash.set";
import { active } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import {
  BookImage,
  ChevronRight,
  Database,
  ExternalLink,
  House,
  LayoutTemplate,
  PanelLeftOpen,
  PanelRightOpen,
  ScrollText,
  Server,
  SquareTerminal,
  Terminal,
} from "lucide-react";
import { EdSave } from "popup/build/ed-save";
import { EdDeployPopup } from "popup/deploy/ed-deploy";
import { EdConsolePopup } from "popup/console/ed-console";
import { closeEditor } from "popup/script/ed-workbench";
import { PRASI_CORE_SITE_ID } from "prasi-utils";
import { FC, ReactElement, useEffect } from "react";
import { navigate } from "utils/react/navigate";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
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
  const local = useLocal({});
  if (p.ui.topbar.render !== local.render) p.ui.topbar.render = local.render;

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

  const topbar_mode = p.ui.topbar.mode;
  const disconnected = p.sync?.ws.readyState !== WebSocket.OPEN;
  return (
    <div
      className={cx(
        "min-h-[35px] h-[35px] border-b flex items-stretch text-[12px] justify-between relative",
        disconnected && "bg-red-600",
        css`
          .btn {
            height: 24px;
          }
        `
      )}
    >
      <div className="top-left flex items-stretch">
        <ButtonBox>
          <Button
            className={cx(
              "border border-r-0 btn px-2 py-[2px] flex items-center space-x-1",
              "hover:bg-blue-100 bg-white"
            )}
            onClick={() => {
              p.ui.popup.site = (id) => {
                active.comp_id = "";
                location.href = `/ed/${id}`;
              };
              p.render();
            }}
          >
            <House size={12} />
            <div className="capitalize">{p.site?.name}</div>
          </Button>

          <Button
            className={cx(
              "border rounded-sm rounded-l-none btn px-2 py-[2px] flex items-center space-x-1",
              "hover:bg-blue-100 bg-white"
            )}
            onClick={() => {
              p.ui.popup.page.open = ({ url }) => {
                p.ui.popup.page.open = null;
                active.comp_id = "";
                active.item_id = "";
                navigate(url);
              };
              p.render();
            }}
          >
            <BookImage size={12} />
            <div className="capitalize">{p.page.cur.name}</div>
          </Button>
        </ButtonBox>

        <ButtonBox>
          <Button
            href={
              location.hostname === "localhost"
                ? `http://localhost:8443/?folder=/site/${p.site?.id}/site/src`
                : `https://prasi-vsc.avolut.com/?folder=/site/${p.site?.id}/site/src`
            }
          >
            <img src="/img/vscode.svg" width={12} />
          </Button>
        </ButtonBox>

        <ButtonBox>
          <Button
            popover={{
              content: <EdDeployPopup />,
            }}
          >
            <Server size={12} />
          </Button>
        </ButtonBox>

        <div className="flex cursor-pointer items-center select-none ml-2">
          <Button
            popover={{
              content: <EdConsolePopup />,
            }}
            className={cx(
              "flex items-center align-top pl-[4px] pr-[7px] space-x-[3px] border py-0 max-h-[20px] rounded-sm",
              "hover:bg-green-100 border-green-800 text-green-800"
            )}
          >
            <ChevronRight size={18} strokeWidth={1} className="-mx-1" />
            <div className={cx("text-[9px]")}>OK</div>
          </Button>
        </div>

        {!p.ui.panel.left && (
          <div
            className="flex items-center ml-3 m-1 cursor-pointer hover:text-blue-600"
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
            <PanelLeftOpen size={15} />
          </div>
        )}
      </div>
      <div className="top-center flex items-stretch absolute inset-0 justify-center pointer-events-none">
        {!disconnected && (
          <>
            <div className="flex items-center pointer-events-auto">
              <Tooltip
                content={
                  <div className="flex items-center space-x-2">
                    <div>Previous item</div>{" "}
                    <div className="border border-slate-600 border-b-2 px-1 rounded-sm">
                      Ctrl + -
                    </div>
                    <div>OR</div>
                    <div className="border border-slate-600 border-b-2 px-1 rounded-sm">
                      Win + -
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
                    <div>OR</div>
                    <div className="border border-slate-600 border-b-2 px-1 rounded-sm">
                      Win + =
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

            <ButtonBox>
              <Button
                className={cx(
                  "border rounded-sm rounded-r-none",
                  topbar_mode === "page" && p.ui.popup.script.open
                    ? "bg-orange-600 text-white border-orange-600"
                    : "hover:bg-orange-100 text-slate-600 bg-white"
                )}
                onClick={() => {
                  p.ui.topbar.mode = "page";
                  p.ui.popup.script.open = true;
                  p.render();
                }}
              >
                <ScrollText size={12} /> <div>Code</div>
              </Button>

              <Button
                className={cx(
                  "border rounded-sm rounded-l-none rounded-r-none border-l-0",
                  topbar_mode === "page" && !p.ui.popup.script.open
                    ? "bg-green-600 text-white border-green-600"
                    : "hover:bg-green-100 text-slate-600 bg-white"
                )}
                onClick={() => {
                  p.ui.topbar.mode = "page";
                  closeEditor(p);
                  p.render();
                }}
              >
                <LayoutTemplate size={12} /> <div>Design</div>
              </Button>

              <Button
                className={cx(
                  "border rounded-sm rounded-l-none border-l-0",
                  topbar_mode === "query"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-blue-100 text-slate-600 bg-white"
                )}
                onClick={() => {
                  p.ui.topbar.mode = "query";
                  closeEditor(p);
                  p.render();
                }}
              >
                <Database size={12} /> <div>Query</div>
              </Button>
            </ButtonBox>
          </>
        )}
        <EdSave />
      </div>
      <div className="top-right flex justify-end pr-1 items-stretch">
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

        {!disconnected && (
          <label className=" text-slate-400 flex items-center pr-1">
            <div className=" px-1"> Zoom</div>
            <select
              value={p.ui.zoom}
              onChange={(e) => {
                p.ui.zoom = e.currentTarget.value;
                localStorage.zoom = p.ui.zoom;
                p.render();
              }}
            >
              {["50%", "60%", "70%", "80%", "90%", "100%", "120%", "150%"].map(
                (e) => {
                  return (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  );
                }
              )}
            </select>
          </label>
        )}

        <ButtonBox>
          {p.site!.id !== PRASI_CORE_SITE_ID && (
            <Button
              href={`/prod/${p.site!.id}${
                p.page.cur.url.startsWith("/")
                  ? p.page.cur.url
                  : `/${p.page.cur.url}`
              }`}
            >
              <ExternalLink size={12} /> <div>Preview</div>
            </Button>
          )}
        </ButtonBox>
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

export const ButtonBox: FC<{ children: any }> = ({ children }) => {
  return (
    <div className="flex cursor-pointer items-center ml-1 pointer-events-auto select-none">
      {children}
    </div>
  );
};

export const Button: FC<{
  children: any;
  className?: string;
  href?: string;
  popover?: { content: ReactElement; open?: boolean };
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
}> = ({ children, onClick, href, className, popover }) => {
  const args = {
    className: cx(
      " btn px-2 py-[2px] flex items-center space-x-1",
      className || "bg-white border rounded-sm hover:bg-blue-100"
    ),

    onClick,
  };

  const content = href ? (
    <a {...args} href={href} target={"_blank"}>
      {children}
    </a>
  ) : (
    <div {...args}>{children}</div>
  );

  if (popover) {
    return (
      <Popover open={popover.open} preload content={popover.content}>
        {content}
      </Popover>
    );
  }

  return content;
};
