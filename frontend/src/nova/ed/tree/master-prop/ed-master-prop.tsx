import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import {
  Clipboard,
  Copy,
  GripVertical,
  Plus,
  Square,
  SquareCheckBig,
  Trash2,
} from "lucide-react";
import { List } from "react-movable";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Tooltip } from "utils/ui/tooltip";
import { EdMasterPropName } from "./ed-mp-name";
import { useRef } from "react";

export const EdMasterProp = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ checked: new Set<string>(), all: false });
  const item = active.comp?.snapshot;
  const comp = item?.component;
  const dragbox = useRef<HTMLDivElement>(null);
  if (!comp) return null;

  const props = item.component?.props || {};
  const entries = Object.entries(props).sort((a, b) => {
    return (a[1].idx || 0) - (b[1].idx || 0);
  });
  return (
    <div className="flex flex-col items-stretch flex-1 w-full h-full text-sm">
      <div
        className={cx(
          "bg-blue-100 flex justify-between border-y border-y-blue-500",
          css`
            .top-btn {
              display: flex;
              align-items: center;
              flex-wrap: nowrap;
              flex-direction: row;
              font-size: 12px;
              border: 1px solid #ccc;
              padding: 0px 5px;
              height: 20px;
              background: white;
              color: black;
              cursor: pointer;
              user-select: none;
              &:hover {
                background: #edf0f9;
              }
            }
          `
        )}
      >
        <div className="p-1 space-x-1 flex-1 flex">
          <div
            className={cx(
              "top-btn ml-[11px]",
              css`
                border: 0 !important;
                background: transparent !important;
              `
            )}
            onClick={() => {
              local.all = !local.all;
              if (local.all) {
                local.checked = new Set(Object.keys(props));
              } else {
                local.checked = new Set();
              }
              local.render();
            }}
          >
            {local.all ? (
              <SquareCheckBig size={13} fill="white" />
            ) : (
              <Square size={13} fill="white" />
            )}
          </div>
          {local.checked.size > 0 && (
            <>
              <Tooltip
                content="Remove selected Master Props"
                className="top-btn"
                onClick={() => {
                  if (confirm("Remove selected Master Props?")) {
                    getActiveTree(p).update(
                      "Remove Master Prop",
                      ({ findNode }) => {
                        const node = findNode(item.id);
                        const props = node?.item.component?.props;
                        if (props) {
                          for (const key of local.checked) {
                            delete props[key];
                          }
                        }
                      }
                    );
                  }
                }}
              >
                <Trash2 size={13} />
              </Tooltip>

              <Tooltip
                content="Copy selected Master Props to clipboard"
                className="top-btn"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(
                      [...local.checked].map((e) => {
                        return { name: e, prop: props[e] };
                      })
                    )
                  );
                  alert(
                    local.checked.size + " Master Props copied to clipboard"
                  );
                }}
              >
                <Copy size={13} />
              </Tooltip>
            </>
          )}

          <Tooltip
            content="Paste Master Props from clipboard"
            className="top-btn"
            onClick={async () => {
              try {
                const pasted = JSON.parse(await navigator.clipboard.readText());

                if (Array.isArray(pasted)) {
                  getActiveTree(p).update(
                    "Paste Master Prop",
                    ({ findNode }) => {
                      const node = findNode(item.id);
                      const props = node?.item.component?.props;
                      if (props) {
                        for (const item of pasted) {
                          if (item.name && item.prop) {
                            props[item.name] = item.prop;
                          }
                        }
                      }
                    }
                  );
                }
              } catch (e) {}
            }}
          >
            <Clipboard size={13} />
          </Tooltip>
        </div>
        <div className="p-1 space-x-1">
          <div
            className="top-btn"
            onClick={() => {
              getActiveTree(p).update("Add Master Prop", ({ findNode }) => {
                const node = findNode(item.id);
                const props = node?.item.component?.props;
                if (props) {
                  let idx = 1;
                  while (props[`prop_${idx}`]) {
                    idx++;
                  }
                  const name = `prop_${idx}`;
                  props[name] = {
                    type: "string",
                    label: `Prop ${idx}`,
                    value: '""',
                    valueBuilt: '""',
                    idx,
                  };
                  p.ui.tree.comp.active = name;
                }
              });
            }}
          >
            <Plus size={13} /> Master Prop
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto" ref={dragbox}>
        <List
          values={entries}
          lockVertically
          container={dragbox.current}
          renderItem={({ value, props, isDragged }) => {
            const drag_handle = (
              <div
                onPointerMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="w-[15px] text-slate-500 flex items-center justify-center border-r hover:bg-blue-600 hover:text-white"
              >
                <GripVertical size={14} />
              </div>
            );
            delete props.key;
            return (
              <li
                key={value[0]}
                {...props}
                className={cx(
                  "list-none cursor-pointer bg-white flex border-b",
                  isDragged ? "border-t" : ""
                )}
              >
                {isDragged ? (
                  drag_handle
                ) : (
                  <Tooltip
                    content={<div>Drag to reorder</div>}
                    delay={0.2}
                    asChild
                  >
                    {drag_handle}
                  </Tooltip>
                )}
                <div
                  className={cx(
                    "flex-1 flex",
                    local.checked.has(value[0]) &&
                      cx(
                        "bg-purple-500 text-white",
                        css`
                          * {
                            border-color: transparent !important;
                            background-color: transparent !important;
                          }
                        `
                      )
                  )}
                  onPointerDown={(e) => {
                    if (p.ui.tree.comp.active === value[0]) {
                      return;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <div
                    onClick={() => {
                      if (!local.checked.has(value[0])) {
                        local.checked.add(value[0]);
                      } else {
                        local.checked.delete(value[0]);
                      }
                      local.render();
                    }}
                    className={cx(
                      "flex items-center justify-center border-r w-[23px]"
                    )}
                  >
                    {local.checked.has(value[0]) ? (
                      <SquareCheckBig size={13} />
                    ) : (
                      <Square size={13} />
                    )}
                  </div>
                  <EdMasterPropName name={value[0]} prop={value[1]} />
                </div>
              </li>
            );
          }}
          onChange={({ oldIndex, newIndex }) => {
            getActiveTree(p).update("Reorder Master Prop", ({ tree }) => {
              if (tree.type === "item") {
                const from = entries[oldIndex][0];
                const to = entries[newIndex][0];
                const props = tree.component?.props;
                if (props) {
                  props[to].idx = oldIndex;
                  props[from].idx = newIndex;
                }
              }
            });
          }}
          renderList={({ children, props }) => {
            return (
              <ul className="absolute inset-0" {...props}>
                {children}
              </ul>
            );
          }}
        />
      </div>
    </div>
  );
};
