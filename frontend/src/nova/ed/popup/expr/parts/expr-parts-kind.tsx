import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { ExprPartList } from "./expr-parts-list";
import { EOutputType, PExpr, PTypedExpr } from "../lib/types";

export const ExprPartsKind: FC<{
  name: string;
  label?: string;
  expected_type?: EOutputType[];
  value: PTypedExpr<any>;
  onChange: (value: PTypedExpr<any>) => void;
}> = ({ name, label, expected_type, value, onChange }) => {
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
        onClick={() => {
          local.open = true;
          local.render();
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
        local.open = open;
        local.render();
      }}
      backdrop={false}
      content={
        <ExprPartList
          selected={name}
          onChange={(e) => {
            let kind = "expr";
            if (e.group === "value") {
              kind = "value";
            }

            let history = { ...value.history };
            if (e.name !== value.name) {
              history[kind + "|" + value.name] = JSON.parse(
                JSON.stringify(value)
              );

              onChange({
                kind: "expr",
                name: e.name,
                expr: {},
                history,
              });
            }
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
