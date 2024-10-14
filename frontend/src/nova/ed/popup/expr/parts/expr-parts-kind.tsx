import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartsKind: FC<{ name: string; label?: string }> = ({
  name,
  label,
}) => {
  const local = useLocal({
    open: false,
    action: {} as
      | {
          selectNext: () => void;
          selectPrev: () => void;
          pick: () => void;
        }
      | undefined,
  });

  if (!local.open) {
    return <div className={cx("expr expr-kind", name)}>{label || name}</div>;
  }

  return (
    <Popover
      className={cx("expr expr-kind", name)}
      content={
        <ExprPartList
          selected={name}
          onChange={(e) => {
            console.log(e);
          }}
          bind={(act) => (local.action = act)}
          // filter={(item) => {
          //   if (item.type === "group" && item.name === "Value") return false;
          //   return true;
          // }}
        />
      }
    >
      {label || name}
    </Popover>
  );
};
