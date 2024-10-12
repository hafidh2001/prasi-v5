import { evalExpr } from "../lib/eval";
import { ExprGroup } from "../lib/group";
import { defineExpression } from "../lib/types";

export default defineExpression({
  name: "if",
  group: ExprGroup.Condition,
  fields: {
    condition: { kind: "expression" },
    then: { kind: "expression" },
    else_if: { kind: "expression", only_expr: ["if"], optional: true },
    else: { kind: "expression", optional: true },
  },
  evaluate(current) {
    const condition = evalExpr(current.expr.condition);

    if (!condition.value) {
      return evalExpr(current.expr.then);
    }

    return { value: null, type: "null" };
  },
  Component({}) {
    return <></>;
  },
});
