import { getNodeById } from "crdt/node/get-node-by-id";
import { active } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import { ScrollText, Sticker, X } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { EdMonacoProp } from "./monaco-prop";
import { EdPrasiCodeItem } from "./prasi-code-item";
import { codeUpdate } from "./prasi-code-update";
import { EdWorkbenchPaneAction } from "../parts/pane-action";
import { EdScriptSnippet } from "../parts/snippet";
import { formatItemName } from "../../../tree/parts/node/node-name";

export const EdScriptWorkbench: FC<{}> = ({}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ active_id: "" });
  const popup = p.ui.popup.script;
  const div = useRef<HTMLDivElement>(null);
  popup.wb_render = local.render;

  const node = getNodeById(p, active.item_id);
  const item = node?.item;
  useEffect(() => {
    if (!local.active_id) {
      local.active_id = active.item_id;
      local.render();
    } else {
      setTimeout(() => {
        local.active_id = active.item_id;
        local.render();
      }, 200);
    }
  }, [active.item_id]);

  const scriptNav = {
    canNext: active.script_nav.idx < active.script_nav.list.length - 1,
    canBack: active.script_nav.list.length > 0,
  };

  const is_error = popup.typings.status === "error" && popup.mode === "js";
  const ui = p.ui.comp.prop;

  if (
    node &&
    node.item.component?.id &&
    node.item.component.id !== active.comp?.id
  ) {
    if (p.ui.comp.prop.active) {
      p.ui.popup.script.mode = "prop";
      return (
        <div className="flex flex-col flex-1 items-stretch">
          <div
            className={cx(
              "flex border-b items-stretch justify-between h-[32px]"
            )}
          >
            <CompTitleInstance />
            <EdWorkbenchPaneAction />
          </div>
          <div
            className={cx(
              "relative flex-1",
              css`
                > * {
                  position: absolute !important;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  top: 0;
                }
              `
            )}
            ref={div}
          >
            <EdMonacoProp
              div={div}
              onChange={({ model, value, editor }) => {
                if (model.id && model.source !== value) {
                  model.source = value;
                  model.exports = {};

                  codeUpdate.push(p, model.id, value, {
                    local_name: model.local?.name,
                    prop_name: model.prop_name,
                  });
                }
              }}
            />
          </div>
        </div>
      );
    }
    return (
      <>
        <div
          onClick={() => {
            closeEditor(p);
          }}
          className="absolute right-0 top-2 flex items-center justify-center px-1 pr-2 cursor-pointer hover:text-red-600"
        >
          <X size={13} />
        </div>
        <div className="flex items-center text-sm text-center flex-col justify-center flex-1">
          <ScrollText className="mb-2" />
          Please access component
          <br /> props to edit script.
        </div>
      </>
    );
  }

  const has_expression = !!node?.item.content || !!node?.item.loop;

  let mode = popup.mode;
  if (has_expression) {
    mode = "css";
  }

  return (
    <div className="flex flex-1 flex-col select-none">
      {item && (
        <>
          <div
            className={cx(
              "flex border-b items-stretch justify-between h-[32px]",
              is_error && "bg-red-100"
            )}
          >
            <div
              className={cx(
                "flex items-stretch",
                css`
                  .tab-btn {
                    height: 20px;
                  }
                  .top-btn {
                    display: flex;
                    align-items: center;
                    flex-direction: row;
                    font-size: 12px;
                    border: 1px solid #ccc;
                    padding: 0px 5px;
                    height: 20px;
                    cursor: pointer;
                    &:hover {
                      background: #edf0f9;
                    }
                  }
                `
              )}
            >
              {popup.type === "prop-master" && <CompTitleMaster />}
              {popup.type === "prop-instance" && <CompTitleInstance />}
              {popup.type === "item" && (
                <>
                  <div
                    className={cx("flex px-1 items-center space-x-1 border-r")}
                  >
                    {(!has_expression
                      ? [
                          { type: "js", color: "#e9522c" },
                          { type: "css", color: "#188228" },
                          { type: "html", color: "#2c3e83" },
                        ]
                      : [{ type: "css", color: "#188228" }]
                    ).map((e) => {
                      return (
                        <div
                          key={e.type}
                          className={cx(
                            css`
                              color: ${e.color};
                              border: 1px solid ${e.color};
                            `,
                            "uppercase text-white text-[12px] cursor-pointer flex items-center justify-center transition-all hover:opacity-100 w-[40px] text-center tab-btn",
                            popup.mode === e.type
                              ? css`
                                  background: ${e.color};
                                  color: white;
                                `
                              : "opacity-30"
                          )}
                          onClick={() => {
                            popup.mode = e.type as any;
                            p.render();
                          }}
                        >
                          {e.type}
                        </div>
                      );
                    })}
                  </div>
                  {has_expression && (
                    <div className="flex items-center text-sm pl-2 text-slate-400">
                      JS is disabled because this item has expression{" "}
                      <div
                        onClick={() => {
                          p.ui.right.tab = "events";
                          p.ui.popup.events.open = node.item.loop
                            ? "loop"
                            : "content";

                          p.render();
                        }}
                        className="border border-blue-600 px-2 ml-2 text-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white"
                      >
                        Edit
                      </div>
                    </div>
                  )}
                  {mode === "js" && (
                    <>
                      {popup.type === "item" && (
                        <>
                          {/* 
                        <div className="border-l flex items-center pl-2 p-1 text-xs">
                          <div
                            className={cx(
                              "flex mt-[1px] cursor-pointer border p-[2px] rounded select-none",
                              script_mode === "flow"
                                ? "border-purple-700"
                                : "border-orange-700",
                              css`
                                .script-mode {
                                  padding-top: 1px;
                                  padding-bottom: 2px;
                                }
                              `
                            )}
                          >
                            <div
                              className={cx(
                                "script-mode flex items-center space-x-1 px-2 rounded-[3px]",
                                script_mode === "flow"
                                  ? "bg-purple-700 text-white"
                                  : ""
                              )}
                              onClick={() => {
                                getActiveTree(p).update(
                                  "Switch item js to flow",
                                  ({ findNode }) => {
                                    const node = findNode(active.item_id);
                                    if (node) {
                                      if (!node.item.adv) node.item.adv = {};
                                      node.item.adv.scriptMode = "flow";
                                    }
                                  }
                                );
                              }}
                            >
                              <GitFork size={12} rotate={40} />
                              <div>Flow</div>
                            </div>
                            <div
                              className={cx(
                                "script-mode flex items-center space-x-1 px-2 rounded-[3px]",
                                script_mode === "script"
                                  ? "bg-orange-700 text-white"
                                  : ""
                              )}
                              onClick={() => {
                                getActiveTree(p).update(
                                  "Switch item js to script",
                                  ({ findNode }) => {
                                    const node = findNode(active.item_id);
                                    if (node) {
                                      if (!node.item.adv) node.item.adv = {};
                                      node.item.adv.scriptMode = "script";
                                    }
                                  }
                                );
                              }}
                            >
                              <Code size={12} />
                              <div>Script</div>
                            </div>
                          </div>
                        </div> */}

                          {/* {script_mode === "flow" && (
                          <div className="flex items-center pl-2 border-l ml-1">
                            <Tooltip
                              content="Reset Flow"
                              onClick={() => {
                                if (confirm("Reset Flow ?")) {
                                  fg.prasi.resetDefault(true);
                                }
                              }}
                            >
                              <TopBtn className="h-[23px] rounded-sm">
                                <Trash size={12} />
                              </TopBtn>
                            </Tooltip>
                          </div>
                        )} */}
                          <EdScriptSnippet />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <EdWorkbenchPaneAction />
          </div>

          <div
            className={cx(
              "relative flex-1",
              css`
                > * {
                  position: absolute !important;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  top: 0;
                }
              `
            )}
            ref={div}
          >
            <EdPrasiCodeItem />
          </div>
        </>
      )}
      {!item && (
        <div className="flex items-center text-sm space-y-2 justify-center flex-1 w-full h-full flex-col text-center">
          <Sticker size={40} strokeWidth={1} />
          <div>Code Editor: </div>
          No Item Selected
          <div
            className="border rounded px-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              closeEditor(p);
            }}
          >
            Close Code
          </div>
        </div>
      )}
    </div>
  );
};

export const closeEditor = (p: PG) => {
  p.viref?.resetLocal?.();
  p.ui.comp.prop.active = "";
  p.ui.popup.script.open = false;
  p.render();
};

const CompTitleInstance = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  const node = getNodeById(p, active.item_id);
  const item = node?.item;

  const ui = p.ui.comp.prop;
  if (item && item.component?.id) {
    return (
      <div className="flex text-xs p-2 space-x-1 items-center">
        <div className="bg-blue-700 text-white text-[11px] px-1 mr-1">
          INSTANCE
        </div>
        <div>{formatItemName(item.name)}</div>
        <ArrowRight />
        <div>{ui.active}</div>
      </div>
    );
  }
  return <></>;
};

const CompTitleMaster = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  if (!active.comp) return null;
  const item = p.comp.loaded[active.comp.id].content_tree;
  if (item && item.component?.id) {
    return (
      <div className="flex text-xs p-2 space-x-1 items-center">
        <div className="bg-purple-700 text-white text-[11px] px-1 mr-1">
          MASTER
        </div>
        <div>{item.name}</div>
        <ArrowRight />
      </div>
    );
  }
  return <></>;
};

const ArrowRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);

export const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"22"}
    height={"22"}
    fill="none"
    viewBox="0 0 15 15"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.158 3.135a.5.5 0 01.707.023l3.75 4a.5.5 0 010 .684l-3.75 4a.5.5 0 11-.73-.684L9.566 7.5l-3.43-3.658a.5.5 0 01.023-.707z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M14 18l-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6L14 18z"
    ></path>
  </svg>
);