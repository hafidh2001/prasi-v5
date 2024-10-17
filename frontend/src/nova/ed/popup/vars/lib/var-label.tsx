import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC, ReactNode, useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { VarUsage } from "utils/types/item";
import { EType } from "./type";
import { getBaseType } from "./validate";
import { EdTypeLabel } from "./type-label";
import { useLocal } from "utils/react/use-local";
import { waitUntil } from "prasi-utils";

export const EdVarLabel: FC<{
  value?: VarUsage;
  mode?: "short" | "long";
  empty?: ReactNode;
  className?: string;
  labelClassName?: string;
  onIconClick?: (e: React.MouseEvent) => void;
}> = ({ value, empty, mode, className, onIconClick, labelClassName }) => {
  const local = useLocal({ should_refresh: false });
  const p = useGlobal(EDGlobal, "EDITOR");
  const vars = getActiveTree(p).var_items;

  const _mode = mode || "short";

  const found = vars[value?.var_id || ""];

  useEffect(() => {
    if (local.should_refresh) {
      waitUntil(() => Object.keys(vars).length > 0).then(() => {
        local.should_refresh = false;
        local.render();
      });
    }
  }, []);
  if (Object.keys(vars).length === 0) {
    local.should_refresh = true;
  }

  if (found) {
    const type = getTypeForPath(found.var.type, value?.path || []);
    return (
      <div className={className}>
        <EdTypeLabel type={type} show_label={false} onClick={onIconClick} />
        <div className={cx("flex-1 flex items-center", labelClassName)}>
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
