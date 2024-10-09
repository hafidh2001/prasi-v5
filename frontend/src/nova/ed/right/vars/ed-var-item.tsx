import get from "lodash.get";
import set from "lodash.set";
import { getActiveTree } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import { PNode } from "logic/types";
import { Trash2 } from "lucide-react";
import { FC, ReactNode } from "react";
import { useGlobal } from "utils/react/use-global";
import { IVar } from "utils/types/item";
import { Popover } from "utils/ui/popover";
import { Tooltip } from "utils/ui/tooltip";
import { EdVarEdit } from "./ed-var-edit";
import { EdTypeLabel } from "./lib/label";
import { getBaseType } from "./lib/validate";
import JsonView from "@uiw/react-json-view";
import { useLocal } from "utils/react/use-local";

export const EdVarItem: FC<{ id: string; name: string; node: PNode }> = ({
  id,
  name,
  node,
}) => {
  const p = useGlobal(EDGlobal, "GLOBAL");
  const vars = node.item.vars || {};
  const _var = vars[id];
  if (!_var) return null;
  const local = useLocal({ name });

  const opened = p.ui.popup.vars.id === id;
  return (
    <div
      className={cx(
        "border-b flex text-sm flex-stretch select-none",
        css`
          min-height: 24px;
        `
      )}
    >
      <Wrapper
        id={id}
        name={name}
        opened={opened}
        close={() => {
          p.ui.popup.vars.id = "";
          p.render();
        }}
        variable={_var}
        node={node}
        p={p}
      >
        <div
          className={cx(
            "px-1 flex-1 flex items-center relative cursor-pointer",
            opened
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-600 hover:text-white"
          )}
          onClick={() => {
            p.ui.popup.vars.id = id;
            p.render();
          }}
        >
          <EdTypeLabel type={_var.type} />
          <input
            className={cx(
              "flex-1 my-1 outline-none bg-transparent ",
              opened ? "cursor-text" : "cursor-pointer"
            )}
            spellCheck={false}
            value={local.name}
            onChange={(e) => {
              local.name = e.target.value;
              local.render();
            }}
            onFocus={(e) => {
              e.currentTarget.select();
            }}
            onBlur={() => {
              if (local.name) {
                getActiveTree(p).update(
                  `Rename var ${name}`,
                  ({ findNode }) => {
                    const n = findNode(node.item.id);
                    if (n && n.item.vars && n.item.vars[id]) {
                      n.item.vars[id].name = local.name;
                    }
                  }
                );
              } else {
                local.name = name;
                local.render();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </div>
      </Wrapper>

      {_var && (
        <Tooltip
          content="Delete Variable"
          onClick={() => {
            getActiveTree(p).update(`Remove Variable ${id}`, ({ findNode }) => {
              const n = findNode(node.item.id);
              if (n) {
                if (!n.item.vars) {
                  n.item.vars = {};
                }
                delete n.item.vars[id];
              }
            });
          }}
          className="del flex items-center justify-center w-[25px] border-l cursor-pointer hover:bg-red-500 hover:text-white"
        >
          <Trash2 size={14} />
        </Tooltip>
      )}
    </div>
  );
};

const Wrapper: FC<{
  children: ReactNode;
  opened: boolean;
  id: string;
  name: string;
  variable: IVar<any>;
  node: PNode;
  close: () => void;
  p: PG;
}> = ({ children, opened, id, name, close, variable, node, p }) => {
  if (!opened) return children;
  const value = undefined;
  return (
    <Popover
      backdrop={false}
      open
      asChild
      popoverClassName={css`
        border: 1px solid black;
        background: white;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        .arrow {
          border: 1px solid black;
        }
      `}
      onOpenChange={() => {
        close();
      }}
      content={
        <EdVarEdit
          variable={variable}
          leftContent={
            <>
              <div className="border-b text-xs bg-slate-50 p-1 border-r">
                Current Value:
              </div>

              <div className="flex flex-1 relative overflow-auto border-r ">
                <pre className="absolute inset-0 whitespace-pre-wrap p-2 text-xs monospace leading-3">
                  {typeof value === "object" && value ? (
                    <JsonView value={value} />
                  ) : (
                    JSON.stringify(value) || <>&mdash; Empty &mdash;</>
                  )}
                </pre>
              </div>
            </>
          }
          setValue={(path, value) => {
            const rpath = path.join(".").replace("~~", "default");

            getActiveTree(p).update(`Update var ${id}`, ({ findNode }) => {
              const n = findNode(node.item.id);
              if (n) {
                if (!n.item.vars) {
                  n.item.vars = {};
                }
                if (n.item.vars[id]) {
                  set(n.item.vars[id], rpath, value);
                }
              }
            });
          }}
          onChange={({ path, type, valuePath }) => {
            getActiveTree(p).update(`Update var ${id}`, ({ findNode }) => {
              const n = findNode(node.item.id);
              if (n) {
                if (!n.item.vars) {
                  n.item.vars = {};
                }
                if (!n.item.vars[id])
                  n.item.vars[id] = {
                    id,
                    name,
                    usage: {},
                    history: { type: {}, value: {} },
                    type,
                  };

                const curvar = n.item.vars[id];
                if (curvar) {
                  const path_type = path.replace("~~", "type");
                  const old_root_type = getBaseType(curvar.type);
                  const cur_type = get(curvar, path_type);
                  const cur_base_type = getBaseType(cur_type);

                  if (["object"].includes(old_root_type)) {
                    if (!curvar.history.type[old_root_type])
                      curvar.history.type[old_root_type] = {};

                    if (["object"].includes(cur_base_type)) {
                      set(
                        curvar.history.type,
                        path.replace("~~", old_root_type),
                        cur_type
                      );
                    }
                  }

                  if (type === undefined) {
                    const cur_path = path_type.split(".");
                    const name = cur_path.pop();
                    const cur = get(curvar, cur_path.join("."));
                    if (name) {
                      delete cur[name];
                    }
                  } else {
                    set(curvar, path_type, type);

                    if (
                      !!type &&
                      typeof type === "object" &&
                      typeof (type as any).idx === "number"
                    ) {
                      return;
                    }
                  }

                  const new_base_type = getBaseType(get(curvar, path_type));

                  if (valuePath) {
                    let value = undefined;
                    if (new_base_type === "array") value = [];
                    if (new_base_type === "object") value = {};
                    if (new_base_type === "boolean") value = false;
                    if (new_base_type === "string") value = "";
                    if (new_base_type === "number") value = 0;
                    if (new_base_type === "null") value = null;
                    set(curvar, valuePath.replace("~~", "default"), value);
                  }

                  const old_type = get(
                    curvar.history.type,
                    path.replace("~~", new_base_type)
                  );
                  const old_base_type = getBaseType(old_type);

                  if (new_base_type === "array") {
                    if (old_base_type === "object") {
                      set(curvar, path_type + ".0", old_base_type);
                    } else {
                      set(curvar, path_type + ".0", cur_type);
                    }
                  } else if (new_base_type === "object") {
                    if (old_base_type === new_base_type) {
                      set(curvar, path_type, old_type);
                    }
                  }
                }
              }
            });
          }}
          onRename={({ path, new_name, old_name }) => {
            const rpath = path
              .slice(0, path.length - 2)
              .join(".")
              .replace("~~", "type");
            const bpath = path
              .slice(0, path.length - 2)
              .join(".")
              .replace("~~", "default");
            getActiveTree(p).update(`Update var ${id}`, ({ findNode }) => {
              const n = findNode(node.item.id);
              if (n) {
                const curvar = n.item.vars?.[id];
                if (curvar) {
                  const base = get(curvar, rpath);
                  if (base) {
                    const old = base[old_name];
                    delete base[old_name];
                    base[new_name] = old;
                  }
                }
                if (curvar) {
                  const base = get(curvar, bpath);
                  if (base) {
                    const old = base[old_name];
                    delete base[old_name];
                    base[new_name] = old;
                  }
                }
              }
            });
          }}
        />
      }
      placement="left-start"
    >
      {children}
    </Popover>
  );
};
