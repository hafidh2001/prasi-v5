import { evalExpr } from "../lib/eval";
import { defineExpression } from "../lib/types";

export default defineExpression({
  name: "if",
  fields: {
    condition: { kind: "expression" },
    then: { kind: "expression" },
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
