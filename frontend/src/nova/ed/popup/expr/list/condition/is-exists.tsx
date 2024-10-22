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
  infer({}) {
    return [{ simple: "boolean", type: "boolean" }];
  },
  Component({ value, expected_type, onChange, onFocusChange }) {
    const { name, expr } = value;
    return (
      <>
        <ExprPartsField
          name="value"
          value={value}
          def={this}
          onChange={onChange}
        />
        <ExprPartsKind
          name={name}
          value={value}
          onChange={onChange}
          label={<span className="text-green-700">IS EXISTS </span>}
          expected_type={expected_type}
          onFocusChange={onFocusChange}
        />
      </>
    );
  },
});
