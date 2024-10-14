import { evalExpr } from "../../lib/eval";
import { ExprGroup } from "../../lib/group";
import { defineExpression } from "../../lib/types";
import { ExprPartsField } from "../../parts/expr-parts-field";
import { ExprPartsKind } from "../../parts/expr-parts-kind";

export default defineExpression({
  name: "is-exists",
  label: "… IS EXISTS",
  group: ExprGroup.Condition,
  desc: "",
  output_type: "boolean",
  fields: {
    value: { kind: "expression", label: "Value" },
  },
  evaluate(current) {
    const value = evalExpr(current.expr.value);
    return { value: !!value, type: "boolean" };
  },
  Component({ name, expr, expected_type }) {
    return (
      <>
        <ExprPartsField name="value" value={expr.value} def={this} />
        <ExprPartsKind
          name={name}
          label="IS EXISTS"
          expected_type={expected_type}
        />
      </>
    );
  },
});
