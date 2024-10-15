import { FC } from "react";
import {
  EOutputType,
  EXPR_NAME,
  ExprComponent,
  PExpr,
  PTypedExpr,
} from "../lib/types";
import { allExpression } from "./all-expr";

export const ExprPartBody: FC<{
  value: PTypedExpr<any>;
  onChange: (value: PExpr) => void;
  expected_type?: EOutputType[];
}> = ({ value, expected_type, onChange }) => {
  const { name, expr } = value;
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
  const Component = (def.Component as ExprComponent<any>).bind(def);
  return (
    <div className={cx(`expr expr-body space-x-[2px]`)}>
      <Component
        value={value}
        onChange={onChange}
        expected_type={expected_type}
      />
    </div>
  );
};
