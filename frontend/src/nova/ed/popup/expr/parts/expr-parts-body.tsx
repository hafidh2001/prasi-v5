import { FC } from "react";
import { EXPR_NAME, PExpr } from "../lib/types";
import { allExpression } from "./all-expr";

export const ExprPartBody: FC<{
  name: EXPR_NAME;
  expr: Record<string, PExpr>;
}> = ({ name, expr }) => {
  const def = allExpression.find((d) => d.name === name);

  if (!def) {
    return <>ERROR: Expression Defintion not found for {name} </>;
  }
  const Component = def.Component.bind(def);
  return (
    <div
      className={cx(`expr expr-body`)}
    >
      <Component expr={expr as any} name={name} />
    </div>
  );
};
