import { FC } from "react";
import { allExpression } from "../list/all-expr";
import { fuzzy } from "utils/ui/fuzzy";
import { useLocal } from "utils/react/use-local";
import { PExpr, PExprDefinition } from "../lib/types";
import { Sticker } from "lucide-react";

export const EdExprList: FC<{
  filter: string;
  bind?: (arg: {
    selectNext: () => void;
    selectPrev: () => void;
    pick: () => void;
  }) => void;
  onChange?: (value: PExprDefinition<any>) => void;
}> = ({ filter, bind, onChange }) => {
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
  local.filtered = fuzzy(allExpression, "name", filter);

  const action = local.action;
  if (bind) bind(action);

  if (local.sel_idx >= local.filtered.length || local.sel_idx < 0) {
    local.sel_idx = 0;
  }

  const groups: Record<string, PExprDefinition<any>[]> = {};
  for (const expr of local.filtered) {
    if (!groups[expr.group]) {
      groups[expr.group] = [];
    }
    groups[expr.group].push(expr);
  }

  return (
    <div className="flex flex-col min-w-[100px]">
      {Object.entries(groups).map(([group, group_items]) => {
        return (
          <div key={group} className="flex flex-col pt-1 text-sm">
            <div className="text-xs border-b px-2 text-slate-600">{group}</div>
            <div className="flex flex-col">
              {group_items.map((e) => {
                const idx = local.filtered.indexOf(e);
                return (
                  <div
                    key={e.name}
                    className={cx(
                      "flex items-center py-1 px-2 cursor-pointer",
                      idx > 0 && "border-t",
                      local.sel_idx === idx
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-600 hover:text-white"
                    )}
                    onClick={() => {
                      action.pick(idx);
                    }}
                  >
                    <div>{e.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
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
