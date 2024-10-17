import { Placement } from "@floating-ui/react";
import { TreeVarItems } from "crdt/node/var-items";
import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { ChevronRight, Pencil } from "lucide-react";
import { Resizable } from "re-resizable";
import { FC, ReactNode, useCallback, useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { VarUsage } from "utils/types/item";
import { Popover } from "utils/ui/popover";
import { Tooltip } from "utils/ui/tooltip";
import { EBaseType, EType } from "../lib/type";
import { EdTypeLabel } from "../lib/type-label";
import { getBaseType } from "../lib/validate";

export const EdVarPicker: FC<{
  children: any;
  filter_type?: EBaseType;
  popup_arrow?: Placement;
  add_options?: { label: ReactNode; onClick: () => void }[];
  value?: VarUsage;
  onChange?: (value: VarUsage) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  item_id: string;
}> = ({ children, value, onChange, open, onOpenChange, item_id }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    var_id: "",
    opened: false,
    path: [] as { type: EType; name: string }[],
    val_path: [] as string[],
    vars: [] as {
      name: string;
      id: string;
      type: any;
    }[],
    tree_vars: null as null | TreeVarItems,
    base_type: "" as EBaseType,
  });

  useEffect(() => {
    if (typeof open !== "undefined") {
      local.opened = open;
      local.render();
    }
  }, [open]);

  const reload = useCallback(
    (from_value?: boolean) => {
      if (!local.opened) return;
      const tree = getActiveTree(p);
      const vars: TreeVarItems = {};
      local.tree_vars = vars;
      local.render();

      let cur = tree.nodes.map[item_id];
      while (cur) {
        if (cur && cur.item.vars) {
          for (const [k, v] of Object.entries(cur.item.vars)) {
            if (tree.var_items[k]) {
              vars[k] = tree.var_items[k];
            }
          }
        }
        cur = tree.nodes.map[cur.parent?.id || ""];
      }

      let rendered_vars = Object.entries(vars).map(([k, v]) => {
        return {
          name: v.var.name,
          id: k,
          type: v.var.type,
        };
      });

      if (from_value !== false) {
        local.var_id = value?.var_id || "";
        local.val_path = value?.path || [];
      }

      const parsed_path = [] as { type: EType; name: string }[];
      if (local.var_id) {
        let cur_var = undefined as
          | undefined
          | {
              name: string;
              id: string;
              type: any;
            };

        for (let i = 0; i < (local.val_path || []).length; i++) {
          const cur_path = local.val_path[i];
          cur_var = rendered_vars.find((v) =>
            i === 0 ? v.id === local.var_id : v.name === cur_path
          );
          if (cur_var) {
            if (i === 0 && cur_path === "~~") {
              local.base_type = getBaseType(cur_var.type);
            }

            if (cur_var.name === cur_path || (i === 0 && cur_path === "~~")) {
              parsed_path.push({ name: cur_var.name, type: cur_var.type });

              if (cur_var) {
                const base_type = getBaseType(cur_var!.type);

                if (["object", "array"].includes(base_type)) {
                  rendered_vars = Object.entries(cur_var.type).map(([k, v]) => {
                    const type = base_type === "object" ? (v as any).type : v;
                    const result = {
                      name: k,
                      id: cur_var!.id,
                      type: type,
                    };
                    return result;
                  });
                }
              }
            }
          }
        }
      }

      local.path = parsed_path;
      local.vars = rendered_vars;

      local.render();
    },
    [value, local.opened]
  );

  useEffect(() => {
    reload();
  }, [value, local.opened]);

  if (!local.opened)
    return (
      <div
        className="flex flex-1 flex-row"
        onClick={() => {
          local.opened = true;
          onOpenChange?.(true);
          local.render();
        }}
      >
        {children}
      </div>
    );

  const last = local.path[local.path.length - 1] || { name: "!!", undefined };
  const last_path = {
    name: last.name,
    type: getBaseType(last.type),
  };

  return (
    <Popover
      border="1px solid black"
      open={local.opened}
      asChild
      onOpenChange={(open) => {
        if (onOpenChange) {
          local.opened = open;
          onOpenChange(open);
          if (!open) {
            local.var_id = "";
            local.render();
          }
        } else {
          local.opened = open;
          local.var_id = "";
          local.render();
        }
      }}
      placement="left-start"
      content={
        <Resizable
          defaultSize={{
            height:
              parseInt(localStorage.getItem("prasi-var-picker-h") || "") || 250,
            width:
              parseInt(localStorage.getItem("prasi-var-picker-w") || "") || 250,
          }}
          minWidth={250}
          onResizeStop={(_, __, div) => {
            localStorage.setItem(
              "prasi-var-picker-w",
              div.clientWidth.toString()
            );
            localStorage.setItem(
              "prasi-var-picker-h",
              div.clientHeight.toString()
            );
          }}
          className={cx("flex flex-col text-sm")}
        >
          {local.path.length > 0 &&
            ["object", "array"].includes(local.base_type) && (
              <div className="border-b border-b-[#aaa] h-[25px] flex">
                <div className="flex flex-1 bg-slate-100 overflow-auto relative">
                  <div className="absolute inset-0 pl-2 flex">
                    {local.path.map((item, i) => {
                      let name = item.name;
                      if (i === 0 && local.var_id) {
                        name = local.tree_vars?.[local.var_id].var.name || "";
                      }

                      if (
                        i === local.path.length - 1 &&
                        !["array", "object"].includes(last_path.type)
                      ) {
                        return null;
                      }

                      return (
                        <div
                          className={cx(
                            "flex cursor-pointer items-center whitespace-nowrap",
                            i > 0 && "-ml-[3px]",
                            "hover:text-blue-600"
                          )}
                          key={i}
                          onClick={() => {
                            local.val_path = local.val_path.slice(0, i);
                            if (local.val_path.length === 0) {
                              local.var_id = "";
                            }
                            reload(false);
                          }}
                        >
                          <Tooltip content={name} delay={0}>
                            {name.substring(0, 4)} {name.length > 4 && "…"}
                          </Tooltip>
                          <div className="h-[25px] overflow-hidden flex items-center -ml-4 -mr-2">
                            <ChevronRight
                              strokeWidth={1}
                              size={60}
                              color="#aaa"
                              absoluteStrokeWidth
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div
                  onClick={() => {
                    const var_id = local.var_id;
                    if (var_id) {
                      const var_item = local.tree_vars?.[var_id];
                      if (var_item) {
                        active.item_id = var_item.item_id;
                        p.ui.right.tab = "vars";
                        p.ui.popup.vars.id = var_id;

                        p.render();
                      }
                    }
                  }}
                  className="border-l flex items-center justify-center w-[30px] cursor-pointer hover:bg-blue-600 hover:text-white"
                >
                  <Pencil size={13} />
                </div>
              </div>
            )}
          {local.vars.map((item) => {
            let is_active = false;

            if (local.val_path.length > 0) {
              if (last_path.name === item.name) {
                is_active = true;
              }
            }

            return (
              <div
                key={item.name}
                className="flex border-b items-stretch h-[30px]"
              >
                {local.val_path.length === 0 && (
                  <div
                    onClick={() => {
                      const var_id = item.id;
                      if (var_id) {
                        const var_item = local.tree_vars?.[var_id];
                        if (var_item) {
                          active.item_id = var_item.item_id;
                          p.ui.right.tab = "vars";
                          p.ui.popup.vars.id = var_id;

                          p.render();
                        }
                      }
                    }}
                    className="border-r flex items-center justify-center w-[30px] cursor-pointer hover:bg-blue-600 hover:text-white"
                  >
                    <Pencil size={13} />
                  </div>
                )}
                <div
                  className={cx(
                    "flex flex-1 items-center hover:bg-blue-500 hover:text-white cursor-pointer",
                    is_active && "bg-blue-500 text-white"
                  )}
                  onClick={() => {
                    const path = [...local.val_path];
                    if (!["object", "array"].includes(last_path.type)) {
                      path.pop();
                    }

                    onChange?.({
                      var_id: item.id,
                      path: [...path, item.name].map((e, idx) =>
                        idx === 0 ? "~~" : e
                      ),
                    });
                    local.opened = false;
                    local.render();
                  }}
                >
                  <EdTypeLabel type={item.type} show_label={false} />
                  <div className="leading-3">{item.name}</div>
                </div>

                {["object", "array"].includes(getBaseType(item.type)) && (
                  <div
                    onClick={() => {
                      let name = item.name;
                      if (!local.var_id) {
                        local.var_id = item.id;
                      }
                      if (local.path.length === 0) {
                        name = "~~";
                      }

                      local.val_path = [...local.val_path, name];
                      local.path.push({
                        name,
                        type: item.type,
                      });
                      reload(false);
                    }}
                    className="border-l flex items-center justify-center hover:bg-blue-500 hover:text-white w-[30px] cursor-pointer"
                  >
                    <ChevronRight size={13} />
                  </div>
                )}
              </div>
            );
          })}
        </Resizable>
      }
    >
      {children}
    </Popover>
  );
};
