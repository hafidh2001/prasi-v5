import { FC } from "react";
import { EOutputType, EXPR_NAME, PExpr } from "../lib/types";
import { allExpression } from "./all-expr";
import { ESimpleType } from "popup/vars/lib/type";

export const ExprPartBody: FC<{
  name: EXPR_NAME;
  expr: Record<string, PExpr>;
  expected_type?: EOutputType[];
}> = ({ name, expr, expected_type }) => {
  const def = allExpression.find((d) => {
    if (d.name === name) {
      if (expected_type && expected_type.length > 0 && d.output_type) {
        if (expected_type.includes(d.output_type)) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  });

  if (!def) {
    return <>ERROR: Expression Defintion not found for {name} </>;
  }
  const Component = def.Component.bind(def);
  return (
    <div className={cx(`expr expr-body`)}>
      <Component expr={expr as any} name={name} expected_type={expected_type} />
    </div>
  );
};
