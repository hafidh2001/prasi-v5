import { getActiveNode } from "crdt/node/get-node-by-id";
import { active, ActiveTree, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import {
  Bolt,
  ChevronDown,
  Network,
  RectangleEllipsis,
  SquareFunction,
  Trash,
} from "lucide-react";
import { FC, ReactNode } from "react";
import { useGlobal } from "utils/react/use-global";
import { IFlowOrVar, VarUsage } from "utils/types/item";
import { Popover } from "utils/ui/popover";
import { EdVarLabel } from "../../popup/vars/lib/var-label";
import { EdVarPicker } from "../../popup/vars/picker/picker-var";
import { EdEventItem } from "./ed-event-item";
import { EdEventTypes } from "./ed-event-types";
import { EdExprEditor } from "popup/expr/edit-expr";

export const EdEvents = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const node = getActiveNode(p);

  const item = node?.item;
  if (!item) return null;

  return (
    <div className="flex flex-col flex-1 select-none">
      <div className="text-sm flex flex-1 m-1 my-2 flex-col space-y-1 items-stretch">
        <div className="flex items-center">
          <div className="w-[90px] mr-1">Content</div>
          {node.item.loop ? (
            <div className=" text-slate-500 flex items-center h-[25px] justify-between flex-1">
              <div>Using Loop</div>
              <span
                onClick={() => {
                  const tree = getActiveTree(p);
                  tree.update("Edit Item Content", ({ findNode }) => {
                    const n = findNode(item.id);
                    if (n) {
                      if (n.item.loop) {
                        clearUsage(
                          tree,
                          findNode,
                          { id: item.id, mode: "loop" },
                          n.item.loop
                        );
                      }

                      n.item.loop = undefined;
                    }
                  });
                }}
                className="text-red-600 cursor-pointer px-1 border border-red-100 hover:border-red-500 ml-1"
              >
                Clear
              </span>
            </div>
          ) : (
            <Picker
              value={node.item.content}
              onChange={(value) => {
                const tree = getActiveTree(p);
                tree.update("Edit Item Content", ({ findNode }) => {
                  const n = findNode(item.id);
                  if (n) {
                    if (n.item.content && n.item.content.var) {
                      clearUsage(
                        tree,
                        findNode,
                        { id: item.id, mode: "content" },
                        n.item.content
                      );
                    }

                    n.item.content = value;
                    if (value && value.var) {
                      setUsage(
                        tree,
                        findNode,
                        {
                          id: item.id,
                          mode: "content",
                        },
                        value
                      );
                    }
                  }
                });
              }}
              open={p.ui.popup.events.open === "content"}
              onOpenChange={(open) => {
                if (open) p.ui.popup.events.open = "content";
                else p.ui.popup.events.open = "";
                p.render();
              }}
              empty={<>Children</>}
            ></Picker>
          )}
        </div>
        <div className="flex items-center">
          <div className="w-[90px] mr-1">Loop Items</div>

          <Picker
            value={node.item.loop}
            onChange={(value) => {
              const tree = getActiveTree(p);
              tree.update("Edit Item loop", ({ findNode }) => {
                const n = findNode(item.id);
                if (n) {
                  if (n.item.loop && n.item.loop.var) {
                    clearUsage(
                      tree,
                      findNode,
                      { id: item.id, mode: "loop" },
                      n.item.loop
                    );
                  }

                  n.item.loop = value;
                  if (value && value.var) {
                    setUsage(
                      tree,
                      findNode,
                      {
                        id: item.id,
                        mode: "loop",
                      },
                      value
                    );
                  }
                }
              });
            }}
            empty={<div className="text-slate-400">Empty</div>}
            open={p.ui.popup.events.open === "loop"}
            onOpenChange={(open) => {
              if (open) p.ui.popup.events.open = "loop";
              else p.ui.popup.events.open = "";
              p.render();
            }}
          ></Picker>
        </div>
      </div>
      <div className="flex flex-col border-t flex-1">
        {Object.entries(EdEventTypes).map(([event]) => {
          return <EdEventItem key={event} type={event} node={node} />;
        })}
      </div>
    </div>
  );
};

const clearUsage = (
  tree: ActiveTree,
  findNode: (id: string) => null | PNode,
  used_by: { id: string; mode: "content" | "loop" },
  usage: { var?: VarUsage }
) => {
  const var_id = usage.var?.var_id;
  if (var_id) {
    const source = tree.var_items[var_id];
    if (source?.item.id) {
      const n = findNode(source.item.id);
      if (n && n.item.vars) {
        const _var = n.item.vars[var_id];
        if (_var && _var.usage && _var.usage[used_by.id]) {
          delete _var.usage[used_by.id][used_by.mode];

          if (Object.keys(_var.usage[used_by.id]).length === 0) {
            delete _var.usage[used_by.id];
          }
        }
      }
    }
  }
};

const setUsage = (
  tree: ActiveTree,
  findNode: (id: string) => null | PNode,
  used_by: { id: string; mode: "content" | "loop" },
  usage: { var?: VarUsage }
) => {
  const var_id = usage.var?.var_id;
  if (var_id) {
    const source = tree.var_items[var_id];
    if (source?.item.id) {
      const n = findNode(source.item.id);
      if (n && n.item.vars) {
        const _var = n.item.vars[var_id];
        if (_var) {
          if (!_var.usage) _var.usage = {};
          if (!_var.usage[used_by.id]) {
            _var.usage[used_by.id] = {};
          }
          _var.usage[used_by.id][used_by.mode] = true;
        }
      }
    }
  }
};

const Picker: FC<{
  value?: IFlowOrVar;
  onChange: (value?: IFlowOrVar) => void;
  empty: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ empty, value, onChange, open, onOpenChange }) => {
  const mode = value?.mode;

  const content = (
    <div
      className={cx(
        "flex items-stretch flex-row  flex-nowrap h-[25px]",
        value && "border border-blue-500"
      )}
    >
      {value && (
        <div
          className={cx(
            "pr-[5px] cursor-pointer hover:bg-blue-600 hover:text-white flex items-center space-x-1",
            "border overflow-hidden"
          )}
        >
          {value.mode === "var" && (
            <>
              <EdVarLabel
                value={value.var}
                empty={
                  <>
                    <div
                      className={cx(
                        "mx-1 flex justify-center",
                        css`
                          svg {
                            width: 15px;
                            height: 15px;
                          }
                        `
                      )}
                    >
                      {iconVar}
                    </div>
                    <div className="whitespace-nowrap text-sm">
                      Pick Variable
                    </div>
                  </>
                }
              />
            </>
          )}
          {value.mode === "expr" && (
            <>
              <div
                className={cx(
                  "mx-1 flex justify-center",
                  css`
                    svg {
                      width: 15px;
                      height: 15px;
                    }
                  `
                )}
              >
                {iconExpr}
              </div>
              <div className="whitespace-nowrap text-xs">Edit Expression</div>
            </>
          )}
        </div>
      )}
      <Popover
        asChild
        border="1px solid black"
        content={
          <div className="flex flex-col text-sm">
            {[
              {
                name: "Use Variable",
                icon: iconVar,
                active: value?.mode === "var",
                onClick: () => {
                  onOpenChange(true);
                  onChange({ ...value, mode: "var" });
                },
              },
              {
                name: "Use Expression",
                icon: iconExpr,
                active: value?.mode === "expr",
                onClick: () => {
                  onChange({ ...value, mode: "expr" });
                },
              },
              !!value
                ? {
                    name: "Clear",
                    icon: (
                      <Trash
                        size={12}
                        className={css`
                          width: 12px !important;
                          height: 12px !important;
                        `}
                      />
                    ),
                    active: !value,
                    className: "text-red-500",
                    onClick: () => {
                      onChange(undefined);
                    },
                  }
                : null,
            ].map((e) => {
              if (!e) return null;
              return (
                <div
                  key={e.name}
                  className={cx(
                    "flex py-1 px-2 border-b items-center  cursor-pointer",
                    e.active
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-600 hover:text-white",
                    e.className
                  )}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    e.onClick();
                  }}
                >
                  <div
                    className={cx(
                      "mr-1 flex justify-center",
                      css`
                        width: 20px;
                        svg {
                          width: 15px;
                          height: 15px;
                        }
                      `
                    )}
                  >
                    {e.icon}
                  </div>
                  {e.name}
                </div>
              );
            })}
          </div>
        }
      >
        <div
          className={cx(
            "border flex justify-center items-center hover:bg-blue-600 hover:text-white cursor-pointer",
            value ? "border-l-0 w-[25px]" : ""
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {!value ? (
            <div className="px-2 flex items-center">
              {empty} <ChevronDown size={12} className="ml-2" />
            </div>
          ) : (
            <Bolt size={12} />
          )}
        </div>
      </Popover>
    </div>
  );

  if (mode === "var") {
    return (
      <EdVarPicker
        value={value?.var}
        onChange={(_var) => {
          onChange({ ...value, var: _var, mode });
          onOpenChange(false);
        }}
        open={open}
        onOpenChange={(open) => {
          onOpenChange(open);
        }}
        item_id={active.item_id}
      >
        {content}
      </EdVarPicker>
    );
  }

  if (mode === "expr") {
    return (
      <EdExprEditor
        value={value?.expr}
        onChange={(expr) => onChange({ ...value, expr, mode })}
        open={open}
        onOpenChange={(open) => {
          onOpenChange(open);
        }}
        item_id={active.item_id}
      >
        {content}
      </EdExprEditor>
    );
  }

  return content;
};

const iconExpr = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12.42 5.29c-1.1-.1-2.07.71-2.17 1.82L10 10h2.82v2h-3l-.44 5.07A4.001 4.001 0 012 18.83l1.5-1.5c.33 1.05 1.46 1.64 2.5 1.3.78-.24 1.33-.93 1.4-1.74L7.82 12h-3v-2H8l.27-3.07a4.01 4.01 0 014.33-3.65c1.26.11 2.4.81 3.06 1.89l-1.5 1.5c-.25-.77-.93-1.31-1.74-1.38M22 13.65l-1.41-1.41-2.83 2.83-2.83-2.83-1.43 1.41 2.85 2.85-2.85 2.81 1.43 1.41 2.83-2.83 2.83 2.83L22 19.31l-2.83-2.81L22 13.65z"
    ></path>
  </svg>
);

const iconVar = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M3 16V8q0-.425.288-.713T4 7h16q.425 0 .713.288T21 8v3h-2V9H5v6h9v2H4q-.425 0-.713-.288T3 16zm2-1V9v6zm13 1.425V18.5q0 .425-.288.713T17 19.5q-.425 0-.713-.288T16 18.5V14q0-.425.288-.713T17 13h4.5q.425 0 .713.288T22.5 14q0 .425-.288.713T21.5 15h-2.1l2.9 2.875q.3.3.3.713t-.3.712q-.3.3-.713.3t-.712-.3L18 16.425z"
    ></path>
  </svg>
);
