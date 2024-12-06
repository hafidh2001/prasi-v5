import { initPage } from "crdt/init-page";
import { activateComp } from "crdt/load-comp-tree";
import { loadPageTree } from "crdt/load-page-tree";
import { loadPendingComponent } from "crdt/node/load-child-comp";
import { active } from "logic/active";
import { Sticker } from "lucide-react";
import { EdPopPagePicker } from "popup/page/page-popup";
import { EdPopItemScript } from "popup/script/ed-item-script";
import { EdPopSitePicker } from "popup/site/site-popup";
import { useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useGlobal } from "../../utils/react/use-global";
import { w } from "../../utils/types/general";
import { isLocalhost } from "../../utils/ui/is-localhost";
import { Loading } from "../../utils/ui/loading";
import { prasiKeybinding } from "./ed-keybinds";
import { EdLeft } from "./ed-left";
import { EdRight } from "./ed-right";
import { EdTopBar } from "./ed-topbar";
import { EdViRoot } from "./ed-vi-root";
import { mainStyle } from "./ed-vi-style";
import { EDGlobal } from "./logic/ed-global";
import { WizardQuerySelect } from "./mode/query/wizard-query-select";
import { EdPopCompGroup } from "./popup/comp/comp-group";
import { EdPopCompPicker } from "./popup/comp/comp-picker";
import { iconVSCode } from "./ui/icons";


export const EdBase = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const div = useRef<HTMLDivElement>(null);

  prasiKeybinding(p);

  if (!p.page.tree && p.page.cur && p.sync) {
    p.page.pending_instances = {};
    const page = initPage(p);
    p.page.tree = loadPageTree(p, p.sync, p.page.cur.id, {
      async loaded(content_tree) {
        await loadPendingComponent(p);
        if (active.comp_id && !active.comp) {
          activateComp(p, active.comp_id);
        }

        page.prepare(content_tree);

        p.render();
        p.ui.editor.render();
        setTimeout(() => {
          p.ui.page.loaded = true;
          p.render();
        }, 100);
      },
      async on_component(item) {
        if (p.sync && item.component) {
          const comp_id = item.component.id;
          p.page.pending_instances[item.id] = item;
          if (item.component?.instances) {
            page.uncleaned_comp_ids.add(item.id);
          }
          page.comp_ids.add(comp_id);
          if (!p.comp.loaded[comp_id] && !p.comp.pending.has(comp_id)) {
            p.comp.pending.add(comp_id);
          }
        }
      },
    });
  }

  if (p.status === "load-site" && p.site) {
    return (
      <Loading
        note={
          <div className="flex flex-col items-center space-y-1 relative">
            <div>{p.site.name || p.site.id}</div>
            <div className="pb-2">{`page-${p.status}`}</div>
            {p.site.id && (
              <div className="absolute top-[50px]">
                <a
                  href={`${vscode_url}folder=/site/${p.site.id}/site/src`}
                  target="_blank"
                  className={cx(
                    "flex space-x-1 border items-center rounded-md px-2 cursor-pointer pointer-events-auto",
                    css`
                      svg {
                        width: 11px;
                      }
                    `
                  )}
                >
                  <div dangerouslySetInnerHTML={{ __html: iconVSCode }} />
                  <div>Open VSCode</div>
                </a>
              </div>
            )}
          </div>
        }
      />
    );
  }
  if (p.status === "site-not-found") {
    return (
      <div className="flex fixed inset-0 items-center justify-center">
        {p.status === "site-not-found" ? "Site not found" : "Page not found"}
      </div>
    );
  }

  const script = p.ui.popup.script;
  return (
    <div
      className={cx("flex flex-col flex-1", style)}
      onPointerLeave={() => {
        w.pointer_active = false;
      }}
      onPointerEnter={() => {
        w.pointer_active = true;
      }}
    >
      <EdTopBar />

      {p.ui.topbar.mode === "page" ? (
        <PanelGroup autoSaveId="prasi-mode-page" direction="horizontal">
          <Panel
            hidden={!p.ui.panel.left}
            className={cx(p.ui.panel.left && "flex min-w-[240px]")}
          >
            <EdLeft />
          </Panel>
          <PanelResizeHandle />
          <Panel defaultSize={78} className="flex flex-col">
            <PanelGroup autoSaveId="prasi-editor-right" direction="horizontal">
              <Panel className="flex">
                {p.status === "page-not-found" ? (
                  <div className="flex items-center justify-center flex-1 text-sm">
                    <Sticker size={40} strokeWidth={1} className="mr-1" />
                    <div>Page Not Found</div>
                  </div>
                ) : (
                  <>
                    {script.paned && script.open && p.viref.comp_props ? (
                      <EdPopItemScript />
                    ) : (
                      <div
                        className={cx(
                          "w-full h-full flex flex-1 relative overflow-auto",
                          p.mode === "mobile" ? "flex-col items-center" : "",
                          css``
                        )}
                        onContextMenu={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <div className={cx(mainStyle(p))} ref={div}>
                          <EdViRoot />
                          {p.ui.page.ruler && (
                            <div
                              className={cx(
                                "absolute inset-0 pointer-events-none contain-strict",
                                div.current &&
                                  css`
                                    top: ${div.current.scrollTop}px;
                                    width: ${div.current.clientWidth}px;
                                    height: ${div.current.clientHeight}px;
                                  `,
                                p.ui.page.ruler && rulerCSS
                              )}
                            >
                              <Ruler />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Panel>
              <PanelResizeHandle />
              <Panel
                defaultSize={25}
                hidden={!p.ui.panel.right}
                className={cx(
                  p.ui.panel.right && "flex flex-col min-w-[265px] border-l"
                )}
              >
                <EdRight />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      ) : (
        <PanelGroup autoSaveId="prasi-mode-query" direction="horizontal">
          <Panel
            hidden={!p.ui.panel.left}
            className={cx(p.ui.panel.left && "flex min-w-[240px]")}
          >
            <WizardQuerySelect />
          </Panel>
        </PanelGroup>
      )}

      <>
        <EdPopCompGroup />
        <EdPopCompPicker />
        <EdPopPagePicker />
        <EdPopSitePicker />
        {!script.paned && script.open && <EdPopItemScript />}
      </>
    </div>
  );
};

const vscode_url = isLocalhost()
  ? "http://localhost:8443?"
  : "https://prasi-vsc.avolut.com/?tkn=prasi&";

const style = css`
  .toolbar-box {
    display: flex;
    align-items: stretch;
    border-left: 1px solid #ececeb;
    border-right: 1px solid #ececeb;
    margin: 0px 0px 0px 5px;

    .label {
      display: flex;
      user-select: none;
      align-items: center;
      font-size: 10px;
      margin-top: 1px;
      color: #999;
      text-transform: uppercase;
    }

    .items {
      display: flex;
      align-items: stretch;
      margin-left: 5px;
      color: #555;
      border-left: 1px solid transparent;

      .item {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        border-right: 1px solid transparent;
        padding: 5px;
        border-radius: 0px;

        &:hover {
          background: #ececeb;
        }

        &.disabled {
          color: #ccc;
          cursor: default;
        }
      }

      .item:last-child {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }

    &.no-label {
      padding-left: 0px;
      margin-left: 0px;
      .items {
        margin-left: 0px;
      }
    }

    &:hover {
      border: 1px solid black;

      .items {
        color: #111;
        border-left: 1px solid #ececeb;
        .item {
          border-right: 1px solid #ececeb;
        }
      }
    }
  }
`;

export const mobileCSS = css`
  background-color: white;
  background-image: linear-gradient(45deg, #fafafa 25%, transparent 25%),
    linear-gradient(-45deg, #fafafa 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #fafafa 75%),
    linear-gradient(-45deg, transparent 75%, #fafafa 75%);

  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
`;

const rulerCSS = cx(css`
  --ruler-num-c: #888;
  --ruler-num-fz: 10px;
  --ruler-num-pi: 0.75ch;
  --ruler-unit: 1px;
  --ruler-x: 1;
  --ruler-y: 1;

  --ruler1-bdw: 1px;
  --ruler1-c: #bbb;
  --ruler1-h: 4px;
  --ruler1-space: 5;

  --ruler2-bdw: 1px;
  --ruler2-c: #bbb;
  --ruler2-h: 16px;
  --ruler2-space: 50;

  background-attachment: fixed;
  background-image: linear-gradient(
      90deg,
      var(--ruler1-c) 0 var(--ruler1-bdw),
      transparent 0
    ),
    linear-gradient(90deg, var(--ruler2-c) 0 var(--ruler2-bdw), transparent 0),
    linear-gradient(0deg, var(--ruler1-c) 0 var(--ruler1-bdw), transparent 0),
    linear-gradient(0deg, var(--ruler2-c) 0 var(--ruler2-bdw), transparent 0);
  background-position: 0 0;
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size:
    calc(var(--ruler-unit) * var(--ruler1-space) * var(--ruler-x))
      var(--ruler1-h),
    calc(var(--ruler-unit) * var(--ruler2-space) * var(--ruler-x))
      var(--ruler2-h),
    var(--ruler1-h)
      calc(var(--ruler-unit) * var(--ruler1-space) * var(--ruler-y)),
    var(--ruler2-h)
      calc(var(--ruler-unit) * var(--ruler2-space) * var(--ruler-y));

  /* Ruler Numbers */
  .ruler-x,
  .ruler-y {
    color: var(--ruler-num-c);
    counter-reset: d 0;
    display: flex;
    font-size: var(--ruler-num-fz);
    line-height: 1;
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: fixed;
    pointer-events: none !important;
  }
  .ruler-x {
    height: var(--ruler2-h);
    inset-block-start: 0;
    inset-inline-start: calc(var(--ruler-unit) * var(--ruler2-space));
    opacity: var(--ruler-x);
    width: 100%;
  }
  .ruler-y {
    flex-direction: column;
    height: 100%;
    inset-block-start: calc(var(--ruler-unit) * var(--ruler2-space));
    inset-inline-start: 0;
    opacity: var(--ruler-y);
    width: var(--ruler2-h);
  }
  .ruler-x li {
    align-self: flex-end;
  }
  .ruler-x li,
  .ruler-y li {
    counter-increment: d var(--ruler2-space);
    flex: 0 0 calc(var(--ruler-unit) * var(--ruler2-space));
  }
  .ruler-x li::after {
    content: counter(d) "";
    line-height: 1;
    padding-inline-start: var(--ruler-num-pi);
  }
  .ruler-y li::after {
    content: counter(d) "";
    display: block;
    padding-inline-end: var(--ruler-num-pi);
    transform: rotate(-90deg) translateY(-13px);
    transform-origin: 100% 0%;
    text-align: end;
    width: 100%;
  }
`);
const Ruler = () => {
  return (
    <>
      <ul className="ruler-x">
        {[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
          38, 39,
        ].map((e) => (
          <li key={e} />
        ))}
      </ul>
      <ul className="ruler-y">
        {[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
          38, 39,
        ].map((e) => (
          <li key={e} />
        ))}
      </ul>
    </>
  );
};
