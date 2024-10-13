import { ChevronRight, Sticker } from "lucide-react";
import { FC, ReactNode } from "react";
import { useLocal } from "utils/react/use-local";
import { fuzzy } from "utils/ui/fuzzy";
import { ExprGroupDefinition } from "../lib/group";
import { PExprDefinition } from "../lib/types";
import { allExpression } from "../list/all-expr";
import { Binary } from "lucide-react";
import { EdTypeLabel } from "popup/vars/lib/type-label";
import { Popover } from "utils/ui/popover";
export const ExprPartList: FC<{
  filter?: string;
  bind?: (arg: {
    selectNext: () => void;
    selectPrev: () => void;
    pick: () => void;
  }) => void;
  onChange?: (value: PExprDefinition<any>) => void;
  allow_value?: boolean;
}> = ({ filter, bind, onChange, allow_value }) => {
  const local = useLocal({
    sel_idx: 0,
    filtered: [] as typeof allExpression,
    action: {
      selectNext() {
        local.sel_idx++;
        local.render();
      },
      selectPrev() {
        local.sel_idx--;
        local.render();
      },
      pick(idx?: number) {
        if (typeof idx === "number") {
          local.sel_idx = idx;
        }
        const expr = local.filtered[local.sel_idx];
        if (expr && onChange) {
          onChange(expr);
          return true;
        }
        return false;
      },
    },
  });
  if (filter) {
    local.filtered = fuzzy(allExpression, "name", filter);
  } else {
    local.filtered = allExpression;
  }
  const action = local.action;
  if (bind) bind(action);

  if (local.sel_idx >= local.filtered.length || local.sel_idx < 0) {
    local.sel_idx = 0;
  }

  const raw_groups: Record<string, PExprDefinition<any>[]> = {};
  for (const expr of local.filtered) {
    if (!raw_groups[expr.group]) {
      raw_groups[expr.group] = [];
    }
    raw_groups[expr.group].push(expr);
  }
  const groups = Object.entries(raw_groups);

  return (
    <div className="flex flex-col min-w-[100px] select-none">
      {allow_value !== false && (
        <GroupItem
          name="Value"
          icon={<Binary />}
          items={[
            {
              key: "static",
              type: "group",
              label: "Static",
              items: [
                {
                  label: <EdTypeLabel type="string" show_label />,
                  onClick(e) {},
                },
                {
                  label: <EdTypeLabel type="number" show_label />,
                  onClick(e) {},
                },
                {
                  label: <EdTypeLabel type="boolean" show_label />,
                  onClick(e) {},
                },
              ],
            },
            {
              key: "var",
              type: "item",
              label: "Variable",
              data: {},
              onClick(e) {},
            },
          ]}
          isItemActive={() => {
            return false;
          }}
        />
      )}
      {groups.map(([group, group_items]) => {
        const gdef = (ExprGroupDefinition as any)[group] as
          | undefined
          | { icon: ReactNode };

        return (
          <GroupItem
            key={group}
            name={group}
            icon={gdef?.icon}
            items={group_items.map((e) => {
              return {
                key: group + e.name,
                label: e.label,
                type: "item",
                onClick(ev) {
                  ev.stopPropagation();
                  ev.preventDefault();
                  const idx = local.filtered.indexOf(e);
                  action.pick(idx);
                },
                data: e,
              };
            })}
            isItemActive={(item) => {
              // if (item.data) {
              //   const idx = local.filtered.indexOf(item.data);
              //   if (local.sel_idx === idx) return true;
              // }
              return false;
            }}
          />
        );
      })}

      {local.filtered.length === 0 && (
        <div className="p-1 text-slate-600 flex items-center justify-center flex-col">
          <Sticker size={30} strokeWidth={1.5} absoluteStrokeWidth />
          <div className="text-xs mt-1">
            Expression <br />
            Not Found
          </div>
        </div>
      )}
    </div>
  );
};

const GroupItem: FC<{
  name: string;
  icon?: ReactNode;
  items: (
    | {
        key: any;
        label: ReactNode;
        type: "item";
        onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
        data: any;
      }
    | {
        key: any;
        label: ReactNode;
        type: "group";
        items: {
          label: ReactNode;
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
        }[];
      }
  )[];
  isItemActive: (item: { data: any }) => boolean;
}> = ({ name, icon, items, isItemActive }) => {
  const local = useLocal({ open: null as any });
  return (
    <div className="flex flex-col pt-1 text-sm">
      <div
        className={cx(
          css`
            svg {
              width: 12px;
              height: 12px;
              margin-right: 4px;
            }
          `,
          "text-xs border-b mt-[10px] pb-1 text-slate-600 flex items-center"
        )}
      >
        {icon}
        {name}
      </div>

      <div className="flex flex-col border-b">
        {items.map((e, idx) => {
          const content = (
            <div
              key={e.key}
              className={cx(
                "flex items-center py-1 pl-[15px] cursor-pointer justify-between",
                idx > 0 && "border-t",
                e.type === "item" && isItemActive(e)
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              )}
              onClick={e.type === "item" ? e.onClick : undefined}
            >
              <div className="flex items-center">{e.label}</div>
              {e.type === "group" && (
                <ChevronRight size={14} className="min-w-[20px] ml-2 mr-1" />
              )}
            </div>
          );

          if (e.type === "group") {
            return (
              <Popover
                key={e.key}
                backdrop={false}
                asChild
                placement="right-start"
                content={
                  <div className="flex flex-col text-sm">
                    {e.items.map((child, idx) => {
                      return (
                        <div
                          key={idx}
                          className={cx(
                            "flex items-center py-1 px-[10px] cursor-pointer justify-between",
                            "hover:bg-blue-600 hover:text-white"
                          )}
                          onClick={child.onClick}
                        >
                          {child.label}
                        </div>
                      );
                    })}
                  </div>
                }
                arrow={false}
              >
                {content}
              </Popover>
            );
          }

          return content;
        })}
      </div>
    </div>
  );
};
