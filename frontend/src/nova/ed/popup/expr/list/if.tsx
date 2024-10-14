import { evalExpr } from "../lib/eval";
import { ExprGroup } from "../lib/group";
import { defineExpression, EOutputType } from "../lib/types";
import { ExprPartKind } from "../parts/expr-parts-kind";

export default defineExpression({
  name: "if",
  label: "IF ... THEN ...",
  group: ExprGroup.Condition,
  desc: "",
  output_type: "any",
  fields: {
    condition: { kind: "expression" },
    then: { kind: "expression" },
    else_if: {
      kind: "expression",
      only_expr: ["if"],
      optional: true,
      multiple: true,
    },
    else: { kind: "expression", optional: true },
  },
  evaluate(current) {
    const condition = evalExpr(current.expr.condition);

    if (!condition.value) {
      return evalExpr(current.expr.then);
    }

    return { value: null, type: "null" };
  },
  Component({ name, expr }) {
    return (
      <>
        <ExprPartKind name={name} />
      </>
    );
  },
});
