import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC, ReactNode } from "react";
import { useGlobal } from "utils/react/use-global";
import { VarUsage } from "utils/types/item";
import { EType } from "./type";
import { getBaseType } from "./validate";
import { EdTypeLabel } from "./type-label";

export const EdVarLabel: FC<{
  value?: VarUsage;
  mode?: "short" | "long";
  empty?: ReactNode;
  className?: string;
}> = ({ value, empty, mode, className }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const vars = getActiveTree(p).var_items;

  const _mode = mode || "short";

  const found = vars[value?.var_id || ""];
  if (found) {
    const type = getTypeForPath(found.var.type, value?.path || []);
    return (
      <div className={className}>
        <EdTypeLabel type={type} show_label={false} />
        {value?.path
          ?.map((e, idx) => {
            if (idx === 0) {
              return found.var.name;
            }
            if (_mode === "short") {
              if (idx === (value.path?.length || 0) - 1) {
                return e;
              } else {
                return "";
              }
            } else {
              return e;
            }
          })
          .join(".")}
      </div>
    );
  }
  return empty;
};

export const getTypeForPath = (type: EType, path: string[]) => {
  let cur: any = type;

  for (let i = 0; i < path.length; i++) {
    if (i === 0) continue;
    const key = path[i];
    const type = getBaseType(cur);
    if (type === "object") {
      if (cur[key] && cur[key].type) {
        cur = cur[key].type;
      }
    } else if (type === "array") {
      if (cur[key] && cur[key]) {
        cur = cur[key];
      }
    }
  }

  return cur;
};
