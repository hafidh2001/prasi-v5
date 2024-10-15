import { FC } from "react";
import { EOutputType, PExpr, PExprDefinition, PExprField } from "../lib/types";
import { ExprPartAdd } from "./expr-parts-add";
import { ExprPartBody } from "./expr-parts-body";
import { ExprPartsStatic } from "./expr-parts-static";

export const ExprPartsField: FC<{
  name: string;
  value: PExpr;
  def: PExprDefinition<any>;
  expected_type?: EOutputType[];
}> = ({ name, value, def, expected_type }) => {
  const field = def.fields[name] as PExprField;
  if (!field) return null;
  let content = null;
  if (field.kind === "expression") {
    if (typeof value === "undefined") {
      content = (
        <ExprPartAdd
          bind={(action) => {
            // local.add_focus = action.focus;
          }}
          onChange={(value) => {
            // if (onChange) {
            //   onChange(value);
            // }
          }}
          content={field.label}
          disabled
          expected_type={expected_type}
        />
      );
    } else {
      if (value.kind === "expr") {
        content = (
          <ExprPartBody
            value={value}
            onChange={() => {}}
            expected_type={expected_type}
          />
        );
      } else if (value.kind === "static") {
        content = <ExprPartsStatic type={value.type} value={value.value} />;
      }
    }
  }

  return (
    <div
      className={cx("expr expr-field", typeof value === "undefined" && "empty")}
    >
      {content}
    </div>
  );
};
