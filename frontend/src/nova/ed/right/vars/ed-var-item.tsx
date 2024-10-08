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
import { EObjectEntry, EType } from "./lib/type";
import { getBaseType } from "./lib/validate";
import get from "lodash.get";
import { current } from "immer";

export const EdVarItem: FC<{ name: string; node: PNode }> = ({
  name,
  node,
}) => {
  const p = useGlobal(EDGlobal, "GLOBAL");
  const vars = node.item.vars || {};
  const _var = vars[name];
  if (!_var) return null;

  const opened = p.ui.popup.vars.name === name;
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
        name={name}
        opened={opened}
        close={() => {
          p.ui.popup.vars.name = "";
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
            p.ui.popup.vars.name = name;
            p.render();
          }}
        >
          <div className="flex-1 my-1">{name}</div>
          <EdTypeLabel type={_var.type} />
        </div>
      </Wrapper>

      {_var && (
        <Tooltip
          content="Delete Variable"
          onClick={() => {
            getActiveTree(p).update(
              `Remove Variable ${name}`,
              ({ findNode }) => {
                const n = findNode(node.item.id);
                if (n) {
                  if (!n.item.vars) {
                    n.item.vars = {};
                  }
                  delete n.item.vars[name];
                }
              }
            );
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
  name: string;
  variable: IVar<any>;
  node: PNode;
  close: () => void;
  p: PG;
}> = ({ children, opened, name, close, variable, node, p }) => {
  if (!opened) return children;
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
          setValue={(path, value) => {
            const rpath = path.join(".").replace("~~", "default");

            getActiveTree(p).update(`Update var ${name}`, ({ findNode }) => {
              const n = findNode(node.item.id);
              if (n) {
                if (!n.item.vars) {
                  n.item.vars = {};
                }
                if (n.item.vars[name]) {
                  set(n.item.vars[name], rpath, value);
                }
              }
            });
          }}
          onChange={({ path, type, valuePath }) => {
            getActiveTree(p).update(`Update var ${name}`, ({ findNode }) => {
              const n = findNode(node.item.id);
              if (n) {
                if (!n.item.vars) {
                  n.item.vars = {};
                }
                if (!n.item.vars[name])
                  n.item.vars[name] = {
                    history: { type: {}, value: {} },
                    type,
                  };
                const curvar = n.item.vars[name];
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
                    console.log(curvar, value, valuePath);
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
            getActiveTree(p).update(`Update var ${name}`, ({ findNode }) => {
              const n = findNode(node.item.id);
              if (n) {
                const curvar = n.item.vars?.[name];
                if (curvar) {
                  const base = get(curvar, rpath);
                  const old = base[old_name];
                  delete base[old_name];
                  base[new_name] = old;
                }
                if (curvar) {
                  const base = get(curvar, bpath);
                  const old = base[old_name];
                  delete base[old_name];
                  base[new_name] = old;
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
