import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { EdScriptSnippet } from "./snippet";
import { EdPropGen } from "./prop-gen";
import { Tooltip } from "utils/ui/tooltip";
import { Loading } from "utils/ui/loading";
import { EdMonaco } from "../monaco";
import { IItem } from "utils/types/item";
import { getNodeById } from "crdt/node/get-node-by-id";
import { Code, GitFork } from "lucide-react";

export const EdScriptWorkbench = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ active_id: "" });
  p.ui.popup.script.wb_render = local.render;

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

  const is_error =
    p.ui.popup.script.typings.status === "error" &&
    p.ui.popup.script.mode === "js";

  let script_mode = "flow" as "flow" | "script";
  if (!item?.adv?.scriptMode && item?.adv?.js) {
    script_mode = "script";
  }
  if (item?.adv?.scriptMode) {
    script_mode = item.adv.scriptMode;
  }
  return (
    <div className="flex flex-1 items-stretch">
      <div className="flex flex-1 flex-col ">
        <div
          className={cx(
            "flex border-b items-stretch justify-between",
            is_error && "bg-red-100"
          )}
        >
          <div className={cx("flex items-stretch")}>
            {p.ui.popup.script.type === "prop-master" && <CompTitleMaster />}
            {p.ui.popup.script.type === "prop-instance" && (
              <CompTitleInstance />
            )}
            {p.ui.popup.script.type === "item" && (
              <>
                <div className="flex p-2 space-x-1">
                  {[
                    { type: "js", color: "#e9522c" },
                    { type: "css", color: "#188228" },
                    { type: "html", color: "#2c3e83" },
                  ].map((e) => {
                    return (
                      <div
                        key={e.type}
                        className={cx(
                          css`
                            color: ${e.color};
                            border: 1px solid ${e.color};
                          `,
                          "uppercase text-white text-[12px] cursor-pointer flex items-center justify-center transition-all hover:opacity-100 w-[40px] text-center",
                          p.ui.popup.script.lastMode === e.type
                            ? css`
                                background: ${e.color};
                                color: white;
                              `
                            : "opacity-30"
                        )}
                        onClick={() => {
                          p.ui.popup.script.mode = e.type as any;
                          p.ui.popup.script.lastMode = e.type as any;
                          p.render();
                        }}
                      >
                        {e.type}
                      </div>
                    );
                  })}
                </div>
                {p.ui.popup.script.mode === "js" && (
                  <>
                    {p.ui.popup.script.type === "item" && (
                      <>
                        <div className="border-l flex items-center pl-2 p-1 text-xs">
                          <div
                            className={cx(
                              "flex mt-[1px] cursor-pointer border p-[2px] rounded select-none",
                              script_mode === "flow"
                                ? "border-purple-700"
                                : "border-orange-700",
                              css`
                                .script-mode {
                                  padding-top:1px;
                                  padding-bottom:2px;
                                }
                              `
                            )}
                          >
                            <div
                              className={cx(
                                "script-mode flex items-center space-x-1 px-2 rounded-sm",
                                script_mode === "flow"
                                  ? "bg-purple-700 text-white"
                                  : ""
                              )}
                              onClick={() => {
                                getActiveTree(p).update(({ findNode }) => {
                                  const node = findNode(active.item_id);
                                  if (node) {
                                    if (!node.item.adv) node.item.adv = {};
                                    node.item.adv.scriptMode = "flow";
                                  }
                                });
                              }}
                            >
                              <GitFork size={12} rotate={40} />
                              <div>Flow</div>
                            </div>
                            <div
                              className={cx(
                                "script-mode flex items-center space-x-1 px-2 rounded-sm",
                                script_mode === "script"
                                  ? "bg-orange-700 text-white"
                                  : ""
                              )}
                              onClick={() => {
                                getActiveTree(p).update(({ findNode }) => {
                                  const node = findNode(active.item_id);
                                  if (node) {
                                    if (!node.item.adv) node.item.adv = {};
                                    node.item.adv.scriptMode = "script";
                                  }
                                });
                              }}
                            >
                              <Code size={12} />
                              <div>Script</div>
                            </div>
                          </div>
                        </div>

                        {script_mode !== "flow" && <EdScriptSnippet />}
                        {script_mode === "flow" && <></>}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex items-stretch text-xs pr-2">
            {p.ui.popup.script.type === "prop-instance" && <EdPropGen />}
          </div>
        </div>

        <div className="relative flex flex-1">
          {local.active_id === active.item_id ? (
            <EdMonaco />
          ) : (
            <Loading backdrop={false} note={"opening script"} />
          )}
        </div>
      </div>
    </div>
  );
};

const CompTitleInstance = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  const node = getNodeById(p, active.item_id);
  const item = node?.item;

  if (item && item.component?.id) {
    const props = item.component.props;
    return (
      <div className="flex text-xs p-2 space-x-1 items-center">
        <div className="bg-blue-700 text-white text-[11px] px-1 mr-1">
          INSTANCE
        </div>
        <div>{item.name}</div>
        <ArrowRight />
        <div>{p.ui.popup.script.prop_name}</div>
        <ArrowRight />
        <div>{p.ui.popup.script.prop_kind}</div>
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
        <div>{p.ui.popup.script.prop_name}</div>
        <ArrowRight />
        <div>{p.ui.popup.script.prop_kind}</div>
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
