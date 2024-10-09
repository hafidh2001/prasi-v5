import { Placement } from "@floating-ui/react";
import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { ChevronRight } from "lucide-react";
import { Resizable } from "re-resizable";
import { FC, ReactNode } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { Tooltip } from "utils/ui/tooltip";
import { EdTypeLabel } from "../lib/label";
import { EBaseType, EType } from "../lib/type";
import { getBaseType } from "../lib/validate";
import { VarUsage } from "utils/types/item";

export const EdVarPicker: FC<{
  children: any;
  filter_type?: EBaseType;
  popup_arrow?: Placement;
  add_options?: { label: ReactNode; onClick: () => void }[];
  value?: VarUsage;
  onChange?: (value: VarUsage) => void;
}> = ({ children, value, onChange }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    path: [] as { type: EType; name: string }[],
    var_id: "",
    opened: false,
  });

  if (!local.opened)
    return (
      <div
        onClick={() => {
          local.opened = true;
          local.render();
        }}
      >
        {children}
      </div>
    );

  const vars = getActiveTree(p).var_items;

  let rendered_vars = Object.entries(vars).map(([k, v]) => {
    return {
      name: v.var.name,
      id: k,
      type: v.var.type,
    };
  });

  let reset = false;
  if (value && local.var_id !== value?.var_id) {
    local.var_id = value.var_id;
    reset = true;
  }

  if (local.var_id) {
    let path = [];
    let reset_type = false;
    if (reset && value && value.path) {
      path = value.path;
      local.path = [];
      reset_type = true;
    } else {
      path = local.path.map((e) => e.name);
    }

    let cur_var = undefined as
      | undefined
      | {
          name: string;
          id: string;
          type: any;
        };

    for (let i = 0; i < path.length; i++) {
      cur_var = rendered_vars.find((v) =>
        i === 0 ? v.id === local.var_id : v.name === path[i]
      );
      if (cur_var) {
        if (cur_var.name === path[i] || (i === 0 && path[i] === "~~")) {
          if (reset_type) {
            local.path.push({ name: cur_var.name, type: cur_var.type });
          }

          if (cur_var) {
            rendered_vars = Object.entries(cur_var.type).map(([k, v]) => {
              const base_type = getBaseType(cur_var!.type);
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

  let last_path = "";

  return (
    <Popover
      border="1px solid black"
      open={local.opened}
      onOpenChange={(open) => {
        local.opened = open;
        local.var_id = "";
        local.render();
      }}
      placement="left-start"
      content={
        <Resizable
          defaultSize={{
            height:
              parseInt(localStorage.getItem("prasi-var-picker-h") || "") || 250,
            width:
              parseInt(localStorage.getItem("prasi-var-picker-w") || "") || 200,
          }}
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
          {local.path.length > 0 && (
            <div className="border-b border-b-[#aaa] flex bg-slate-100 h-[25px] overflow-auto relative">
              <div className="absolute inset-0 pl-2 flex">
                {local.path.map((item, i) => {
                  let name = item.name;
                  if (i === 0) {
                    name = vars[local.var_id].var.name;
                  }

                  return (
                    <Tooltip
                      content={name}
                      key={i}
                      className={cx(
                        "flex cursor-pointer items-center whitespace-nowrap",
                        i > 0 && "-ml-[3px]"
                      )}
                      delay={0}
                      onClick={() => {
                        local.path.splice(i);
                        local.render();
                      }}
                    >
                      {name.substring(0, 4)} {name.length > 4 && "…"}
                      <div className="h-[25px] overflow-hidden flex items-center -ml-4 -mr-2">
                        <ChevronRight
                          strokeWidth={1}
                          size={60}
                          color="#aaa"
                          absoluteStrokeWidth
                        />
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}
          {rendered_vars.map((item) => (
            <div
              key={item.name}
              className="flex border-b items-stretch h-[30px]"
            >
              <div
                className={cx(
                  "flex flex-1 items-center hover:bg-blue-500 hover:text-white cursor-pointer",
                  (local.path.length === 0
                    ? item.id === value?.var_id
                    : item.name === last_path) && "bg-blue-500 text-white"
                )}
                onClick={() => {
                  onChange?.({
                    var_id: item.id,
                    path: [...local.path.map((e) => e.name), item.name],
                  });
                }}
              >
                <EdTypeLabel type={item.type} show_label={false} />
                <div>{item.name}</div>
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

                    local.path.push({
                      name,
                      type: item.type,
                    });

                    local.render();
                  }}
                  className="border-l flex items-center justify-center hover:bg-blue-500 hover:text-white w-[30px] cursor-pointer"
                >
                  <ChevronRight size={13} />
                </div>
              )}
            </div>
          ))}
        </Resizable>
      }
    >
      {children}
    </Popover>
  );
};
