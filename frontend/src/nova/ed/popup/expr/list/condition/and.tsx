import { inferType } from "popup/expr/lib/infer-type";
import { evalExpr } from "../../lib/eval";
import { ExprGroup } from "../../lib/group";
import { defineExpression } from "../../lib/types";
import { ExprPartsField } from "../../parts/expr-parts-field";
import { ExprPartsKind } from "../../parts/expr-parts-kind";
import { mergeType } from "popup/expr/lib/merge-type";

export default defineExpression({
  name: "and",
  label: "… AND …",
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
  infer(arg) {
    return [{ simple: "boolean", type: "boolean" }];
  },
  Component({ value, expected_type, onChange, onFocusChange }) {
    const { name, expr } = value;
    return (
      <>
        <ExprPartsField
          name="left"
          value={value}
          def={this}
          expected_type={["boolean"]}
          onChange={onChange}
        />
        <ExprPartsKind
          name={name}
          value={value}
          onChange={onChange}
          label="AND"
          expected_type={expected_type}
          onFocusChange={onFocusChange}
        />
        <ExprPartsField
          name="right"
          value={value}
          def={this}
          expected_type={["boolean"]}
          onChange={onChange}
        />
      </>
    );
  },
});
