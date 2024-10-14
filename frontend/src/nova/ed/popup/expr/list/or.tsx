import { evalExpr } from "../lib/eval";
import { ExprGroup } from "../lib/group";
import { defineExpression } from "../lib/types";
import { ExprPartsField } from "../parts/expr-parts-field";
import { ExprPartKind } from "../parts/expr-parts-kind";

export default defineExpression({
  name: "or",
  label: "... OR ...",
  group: ExprGroup.Condition,
  desc: "",
  output_type: "boolean",
  fields: {
    condition_1: {kind: "expression"},
    condition_2: {kind: "expression"}
  },
  evaluate(current) {
    const value = evalExpr(current.expr.condition_1);
    return { value: !!value, type: "boolean" };
  },
  Component({ name, expr }) {
    return (
      <>
        <ExprPartsField name="condition_1" field={expr.condition_1} />  
        <ExprPartKind name={name} />
        <ExprPartsField name="condition_2" field={expr.condition_2} />  
      </>
    );
  },
});
