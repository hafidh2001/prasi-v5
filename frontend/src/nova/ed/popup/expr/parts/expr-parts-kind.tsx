import { FC, ReactNode } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { EOutputType, ExprBackdrop, PExpr, PTypedExpr } from "../lib/types";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartsKind: FC<{
  name: string;
  label?: ReactNode;
  expected_type?: EOutputType[];
  value: PTypedExpr<any>;
  onChange: (value: PExpr) => void;
  onFocusChange?: (focus: boolean) => void;
}> = ({ name, label, expected_type, value, onFocusChange, onChange }) => {
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
    return (
      <div
        className={cx("expr expr-kind", name)}
        onClick={(e) => {
          e.stopPropagation();
          if (onFocusChange) {
            onFocusChange?.(true);
          } else {
            local.open = true;
            local.render();
          }
        }}
      >
        {label || name}
      </div>
    );
  }

  return (
    <Popover
      className={cx("expr expr-kind focus", name)}
      open
      onOpenChange={(open) => {
        onFocusChange?.(open);
        local.open = open;
        local.render();
      }}
      backdrop={ExprBackdrop}
      content={
        <ExprPartList
          selected={name}
          onChange={(e) => {
            let history = { ...value.history };
            if (value.kind === "expr") {
              history["expr|" + value.name] = JSON.parse(JSON.stringify(value));
            }

            onChange({
              ...e,
              history,
            });

            local.open = false;
            local.render();
          }}
          bind={(act) => (local.action = act)}
          filter={
            expected_type
              ? (item) => {
                  if (item.data?.output_type) {
                    return expected_type.includes(item.data.output_type);
                  }
                  return true;
                }
              : undefined
          }
        />
      }
    >
      {label || name}
    </Popover>
  );
};
