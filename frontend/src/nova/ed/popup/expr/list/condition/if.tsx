import { evalExpr } from "../../lib/eval";
import { ExprGroup } from "../../lib/group";
import { defineExpression, EOutputType } from "../../lib/types";
import { ExprPartsField } from "../../parts/expr-parts-field";
import { ExprPartsKind } from "../../parts/expr-parts-kind";
import { ExprPartsStatic } from "../../parts/expr-parts-static";

export default defineExpression({
  name: "if",
  label: "IF … THEN …",
  group: ExprGroup.Condition,
  desc: "",
  output_type: "any",
  fields: {
    condition: { kind: "expression", label: "Condition" },
    then: { kind: "expression", label: "Result" },
    else_if: {
      label: "Result",
      kind: "expression",
      only_expr: ["if"],
      optional: true,
      multiple: true,
    },
    else: { kind: "expression", optional: true, label: "Result" },
  },
  evaluate(current) {
    const condition = evalExpr(current.expr.condition);

    if (!condition.value) {
      return evalExpr(current.expr.then);
    }

    return { value: null, type: "null" };
  },
  Component({ name, expr, expected_type }) {
    return (
      <>
        <ExprPartsKind name={name} label="IF" expected_type={expected_type} />
        <ExprPartsField
          name="condition"
          value={expr.condition}
          def={this}
          expected_type={["boolean"]}
        />
        <span>THEN</span>
        <ExprPartsField name="then" value={expr.then} def={this} />
      </>
    );
  },
});
