import { FC } from "react";
import { EXPR_NAME, PExpr } from "../lib/types";
import { allExpression } from "../list/all-expr";

export const ExprPartBody: FC<{
  name: EXPR_NAME;
  expr: Record<string, PExpr>;
}> = ({ name, expr }) => {
  const def = allExpression.find((d) => d.name === name);

  if (!def) {
    return <>ERROR: Expression Defintion not found for {name} </>;
  }

  const Component = def.Component;
  return (
    <div
      className={cx(
        `expr-body expr-name-${def.name} expr-group-${def.group}`,
        "p-[1px] ml-1 mt-1 flex flex-stretch"
      )}
    >
      <Component expr={expr as any} name={name} />
    </div>
  );
};
