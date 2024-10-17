import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { EOutputType, PExpr, PExprDefinition, PExprField } from "../lib/types";
import { ExprPartAdd } from "./expr-parts-add";
import { ExprPartBody } from "./expr-parts-body";
import { ExprPartsStatic } from "./expr-parts-static";
import { ExprPartsVar } from "./expr-parts-var";

export const ExprPartsField: FC<{
  name: string;
  value: {
    kind: "expr";
    name: string;
    expr: Record<string, PExpr>;
  };
  def: PExprDefinition<any>;
  expected_type?: EOutputType[];
  onChange: (value: PExpr) => void;
}> = ({ name, value, def, expected_type, onChange }) => {
  const local = useLocal({ value });
  const field = def.fields[name] as PExprField;
  const expr = value.expr[name];

  if (local.value) {
    console.log(local.value);
  }

  if (!field) return null;
  let content = null;
  if (field.kind === "expression") {
    if (typeof expr === "undefined") {
      content = (
        <ExprPartAdd
          onChange={(val) => {
            onChange({ ...value, expr: { ...value.expr, [name]: val } });
          }}
          content={field.label}
          disabled
          expected_type={expected_type}
        />
      );
    } else {
      if (expr.kind === "expr") {
        content = (
          <ExprPartBody
            value={expr}
            parent={{ value, name }}
            onChange={(val) => {
              onChange({ ...value, expr: { ...value.expr, [name]: val } });
            }}
            expected_type={expected_type}
          />
        );
      } else if (expr.kind === "static") {
        content = (
          <ExprPartsStatic
            type={expr.type}
            value={expr.value}
            onChange={(val) => {
              onChange({ ...value, expr: { ...value.expr, [name]: val } });
            }}
          />
        );
      } else if (expr.kind === "var") {
        content = (
          <ExprPartsVar
            value={expr.var}
            onChange={(val) => {
              onChange({ ...value, expr: { ...value.expr, [name]: val } });
            }}
          />
        );
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
