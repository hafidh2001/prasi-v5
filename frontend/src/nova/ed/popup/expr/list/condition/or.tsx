import { evalExpr } from "../../lib/eval";
import { ExprGroup } from "../../lib/group";
import { defineExpression } from "../../lib/types";
import { ExprPartsField } from "../../parts/expr-parts-field";
import { ExprPartsKind } from "../../parts/expr-parts-kind";

export default defineExpression({
  name: "or",
  label: "… OR …",
  group: ExprGroup.Condition,
  desc: "",
  output_type: "boolean",
  fields: {
    left: { kind: "expression", label: "Left Condition " },
    right: { kind: "expression", label: "Right Condition " },
  },
  evaluate(current) {
    const value = evalExpr(current.expr.left);
    return { value: !!value, type: "boolean" };
  },
  Component({ value, onChange, expected_type }) {
    const { name, expr } = value;
    return (
      <>
        <ExprPartsField
          name="left"
          value={expr.left}
          def={this}
          expected_type={["boolean"]}
        />
        <ExprPartsKind
          name={name}
          onChange={onChange}
          value={value}
          label="OR"
          expected_type={expected_type}
        />
        <ExprPartsField
          name="right"
          value={expr.right}
          def={this}
          expected_type={["boolean"]}
        />
      </>
    );
  },
});
