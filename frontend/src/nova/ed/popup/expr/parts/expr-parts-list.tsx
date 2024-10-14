import get from "lodash.get";
import { Binary, ChevronRight } from "lucide-react";
import { EdTypeLabel } from "popup/vars/lib/type-label";
import { FC, ReactNode, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { ExprGroupDefinition } from "../lib/group";
import { PExprDefinition } from "../lib/types";
import { allExpression } from "./all-expr";

export const ExprPartList = ({
  bind,
  filter,
  onChange,
  selected,
}: {
  selected?: string;
  search?: string;
  bind?: (arg: {
    selectNext: () => void;
    selectPrev: () => void;
    pick: () => void;
  }) => void;
  filter?: (item: SingleGroup | SingleItem | SingleParent) => boolean;
  onChange?: (item: { name: string; group: string }, opt: SingleItem) => void;
}) => {
  const local = useLocal({
    active: {
      group: -1,
      item: -1,
      item_open: -1,
      sub: 0,
    },
    action: {
      selectNext() {
        const a = local.active;
        const g = local.groups;

        let next_group = true;
        const group = g[a.group];
        const item = group?.items[a.item];

        if (a.item_open >= 0 && item.type === "parent") {
          a.sub = a.sub + 1;
          let should_return = false;
          if (item.items && a.sub >= item.items.length) {
            a.sub = -1;
            a.item_open = -1;
          } else {
            should_return = true;
          }
          if (should_return) {
            local.render();
            return;
          }
        }

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

        if (group?.items[a.item]?.type === "parent") {
          a.item_open = a.item;
          a.sub = 0;
        }

        local.render();
      },
      selectPrev() {
        const a = local.active;
        const g = local.groups;

        let prev_group = true;
        const group = g[a.group];
        const item = group?.items[a.item];

        if (a.item_open >= 0 && item.type === "parent") {
          a.sub = a.sub - 1;
          let should_return = false;
          if (item.items && a.sub < 0) {
            a.sub = -1;
            a.item_open = -1;
          } else {
            should_return = true;
          }
          if (should_return) {
            local.render();
            return;
          }
        }

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

        if (group?.items[a.item]?.type === "parent") {
          a.item_open = a.item;
          a.sub = group?.items.length;
        }

        local.render();
      },
      pick() {
        const a = local.active;
        const g = local.groups;

        let item = get(g, `${a.group}.items.${a.item}`) as unknown as
          | SingleParent
          | SingleItem;

        let sub = "";
        if (
          item.type === "parent" &&
          item.items &&
          local.active.item_open === a.item &&
          local.active.sub >= 0
        ) {
          sub = item.key;
          item = item.items[local.active.sub];
        }

        if (item.type === "item") {
          onChange?.(
            {
              name: item.name,
              group: g[a.group].name,
            },
            item
          );
        }

        local.active.item_open = -1;
        local.active.sub = -1;
        local.render();

        return true;
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
          type: "group",
          icon: gdef?.icon,
          items: items.map((e) => {
            return {
              name: e.name,
              key: group + e.name,
              label: e.label,
              type: "item",
              data: e,
            };
          }),
        };
      }
    );

    groups.unshift({
      name: "Value",
      type: "group",
      icon: <Binary />,
      items: [
        {
          key: "static",
          type: "parent",
          label: "Static",
          items: [
            {
              name: "string",
              key: "string",
              type: "item",
              label: <EdTypeLabel type="string" show_label />,
            },
            {
              name: "number",
              key: "number",
              type: "item",
              label: <EdTypeLabel type="number" show_label />,
            },
            {
              name: "boolean",
              key: "boolean",
              type: "item",
              label: <EdTypeLabel type="boolean" show_label />,
            },
          ],
        },
        {
          key: "var",
          name: "var",
          type: "item",
          label: "Variable",
          data: {},
        },
      ],
    });
    local.groups = groups;

    if (filter) {
      local.groups = local.groups.filter((item) => {
        if (filter(item)) {
          return item.items.filter((item) => filter(item));
        }
        return false;
      });
    }

    if (selected) {
      for (let i = 0; i < local.groups.length; i++) {
        const group = local.groups[i];
        for (let j = 0; j < group.items.length; j++) {
          const item = group.items[j];
          if (item.data?.name === selected) {
            local.active.group = i;
            local.active.item = j;
            local.active.item_open = -1;
          }
        }
      }
    }

    local.render();
  }, [selected]);

  return (
    <div
      className={cx(
        "flex flex-col min-w-[100px] select-none",
        css`
          /* font-family: "Liga Menlo", monospace; */
        `
      )}
    >
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

              const a = local.active;
              const g = local.groups;

              let item = get(g, `${a.group}.items.${a.item}`) as unknown as
                | SingleParent
                | SingleItem;

              if (item.type === "parent" && item.items) {
                local.active.item_open = a.item;
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

type SingleItem = {
  key: any;
  name: string;
  label: ReactNode;
  type: "item";
  data?: any;
};
type SingleParent = {
  key: any;
  label: ReactNode;
  type: "parent";
  data?: any;
  items: SingleItem[];
};

type SingleGroup = {
  name: string;
  type: "group";
  icon?: ReactNode;
  items: (SingleItem | SingleParent)[];
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
          "text-xs border-b pl-1 pb-1 text-slate-400 flex items-center"
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
              }}
            >
              <div className="flex items-center pr-[15px]">{e.label}</div>
              {e.type === "parent" && (
                <ChevronRight size={14} className="min-w-[20px] ml-2 mr-1" />
              )}
            </div>
          );

          if (e.type === "parent") {
            return (
              <Popover
                key={e.key}
                asChild
                open={sub_open}
                backdrop={false}
                onOpenChange={onSubOpenChange}
                placement="right-start"
                content={
                  <div
                    className={cx(
                      "flex flex-col text-sm",
                      css`
                        /* font-family: "Liga Menlo", monospace; */
                      `
                    )}
                  >
                    {e.items.map((child, cidx) => {
                      return (
                        <div
                          key={cidx}
                          className={cx(
                            "flex items-center py-1 px-[10px] cursor-pointer justify-between",
                            sidx === cidx && "bg-blue-600 text-white",
                            css`
                              .icon {
                                margin-right: 5px !important;
                              }
                            `
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
