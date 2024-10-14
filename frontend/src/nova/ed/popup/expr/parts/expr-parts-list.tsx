import get from "lodash.get";
import { Binary, ChevronRight } from "lucide-react";
import { EdTypeLabel } from "popup/vars/lib/type-label";
import { FC, ReactNode, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { ExprGroupDefinition } from "../lib/group";
import { PExprDefinition } from "../lib/types";
import { allExpression } from "../list/all-expr";

export const ExprPartList: FC<{
  filter?: string;
  bind?: (arg: {
    selectNext: () => void;
    selectPrev: () => void;
    pick: () => void;
  }) => void;
  onChange?: (value: PExprDefinition<any>) => void;
  allow_value?: boolean;
}> = ({ bind, onChange, allow_value }) => {
  const local = useLocal({
    active: {
      group: -1,
      item: -1,
      item_open: -1,
      sub: 0,
    },
    action: {
      selectNext() {
        console.log("next");
        const a = local.active;
        const g = local.groups;

        let next_group = true;
        const group = g[a.group];
        if (group) {
          const item = group.items[a.item + 1];
          if (item) {
            a.item = a.item + 1;
            next_group = false;
          } else {
            a.item = 0;
            next_group = true;
          }
        }

        if (next_group) {
          a.group = a.group + 1;
          if (a.group >= g.length) {
            a.group = 0;
          }
        }
        local.render();
      },
      selectPrev() {
        console.log("prev");

        const a = local.active;
        const g = local.groups;

        let prev_group = true;
        const group = g[a.group];
        if (group) {
          const item = group.items[a.item - 1];
          if (item) {
            a.item = a.item - 1;
            prev_group = false;
          } else {
            a.item = group.items.length;
            prev_group = true;
          }
        }

        if (prev_group) {
          a.group = a.group - 1;
          if (a.group < 0) {
            a.group = g.length - 1;
          }
          a.item = g[a.group].items.length - 1;
        }
        local.render();
      },
      pick() {
        const a = local.active;
        const g = local.groups;

        const item = get(
          g,
          `${a.group}.items.${a.item}`
        ) as unknown as SingleGroup;

        if (item.items) {
          local.active.item_open = a.item;
          local.render();
          return false;
        } else {
          local.active.item_open = -1;
          local.render();
        }

        return false;
      },
    },
    groups: [] as SingleGroup[],
  });
  const action = local.action;
  if (bind) bind(action);

  useEffect(() => {
    const raw_groups: Record<string, PExprDefinition<any>[]> = {};
    for (const expr of allExpression) {
      if (!raw_groups[expr.group]) {
        raw_groups[expr.group] = [];
      }
      raw_groups[expr.group].push(expr);
    }
    const groups: SingleGroup[] = Object.entries(raw_groups).map(
      ([group, items]) => {
        const gdef = (ExprGroupDefinition as any)[group] as
          | undefined
          | { icon: ReactNode };

        return {
          name: group,
          icon: gdef?.icon,
          items: items.map((e) => {
            return {
              key: group + e.name,
              label: e.label,
              type: "item",
              data: e,
            };
          }),
        };
      }
    );

    if (allow_value !== false) {
      groups.unshift({
        name: "Value",
        icon: <Binary />,
        items: [
          {
            key: "static",
            type: "group",
            label: "Static",
            items: [
              {
                label: <EdTypeLabel type="string" show_label />,
              },
              {
                label: <EdTypeLabel type="number" show_label />,
              },
              {
                label: <EdTypeLabel type="boolean" show_label />,
              },
            ],
          },
          {
            key: "var",
            type: "item",
            label: "Variable",
            data: {},
          },
        ],
      });
    }
    local.groups = groups;
    local.render();
  }, [allow_value]);

  return (
    <div className="flex flex-col min-w-[100px] select-none">
      {local.groups.map((group, gidx) => {
        return (
          <GroupItem
            key={group.name}
            gidx={gidx}
            sidx={local.active.sub}
            {...group}
            isItemActive={(item, idx) => {
              if (local.active.group === gidx && local.active.item === idx) {
                return true;
              }

              return false;
            }}
            open={
              local.active.item_open >= 0 &&
              local.active.group === gidx &&
              local.active.item_open === local.active.item
            }
            onOpenChange={(open) => {
              if (!open) {
                local.active.item_open = -1;
                local.render();
              }
            }}
            hover={(gidx, idx, sidx) => {
              let should_render = false;
              if (
                sidx !== local.active.sub &&
                local.active.item_open >= 0 &&
                typeof sidx === "number"
              ) {
                local.active.sub = sidx;
                should_render = true;
              }

              if (local.active.group !== gidx || local.active.item !== idx) {
                local.active.group = gidx;
                local.active.item = idx;
                should_render = true;
              }

              if (should_render) {
                local.render();
              }
            }}
            click={(ev, item) => {
              ev.stopPropagation();
              local.action.pick();
            }}
          />
        );
      })}
    </div>
  );
};

type SingleGroup = {
  name: string;
  icon?: ReactNode;
  items: (
    | {
        key: any;
        label: ReactNode;
        type: "item";
        data?: any;
      }
    | {
        key: any;
        label: ReactNode;
        type: "group";
        data?: any;
        items: {
          label: ReactNode;
        }[];
      }
  )[];
};

const GroupItem: FC<{
  name: SingleGroup["name"];
  icon?: SingleGroup["icon"];
  items: SingleGroup["items"];
  gidx: number;
  sidx: number;
  isItemActive: (item: { data?: any }, idx: number) => boolean;
  hover: (gidx: number, idx: number, sidx?: number) => void;
  click: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, item: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({
  name,
  icon,
  items,
  isItemActive,
  hover,
  gidx,
  click,
  sidx,
  open: sub_open,
  onOpenChange: onSubOpenChange,
}) => {
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
          "text-xs border-b mt-[10px] pb-1 text-slate-400 flex items-center"
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
                isItemActive(e, idx) && "bg-blue-600 text-white"
              )}
              onClick={(ev) => {
                click(ev, e);
              }}
              onMouseEnter={(ev) => {
                hover(gidx, idx);
                if (e.type === "group") {
                  click(ev, e);
                }
              }}
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
                asChild
                backdrop={false}
                open={sub_open}
                onOpenChange={onSubOpenChange}
                placement="right-start"
                content={
                  <div className="flex flex-col text-sm">
                    {e.items.map((child, cidx) => {
                      return (
                        <div
                          key={cidx}
                          className={cx(
                            "flex items-center py-1 px-[10px] cursor-pointer justify-between",
                            sidx === cidx && "bg-blue-600 text-white"
                          )}
                          onClick={(ev) => {
                            click(ev, child);
                          }}
                          onMouseEnter={() => {
                            hover(gidx, idx, cidx);
                          }}
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
