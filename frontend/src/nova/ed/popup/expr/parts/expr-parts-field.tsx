import { FC } from "react";
import { PExpr, PExprDefinition, PExprField } from "../lib/types";
import { ExprPartAdd } from "./expr-parts-add";

export const ExprPartsField: FC<{
  name: string;
  value: PExpr;
  def: PExprDefinition<any>;
}> = ({ name, value, def }) => {
  const field = def.fields[name] as PExprField;
  if (!field) return null;
  let content = null;
  if (field.kind === "expression") {
    // if (name === "condition") {
    //   console.log(name, value, field);
    // }

    content = (
      <>
        <ExprPartAdd
          bind={(action) => {
            // local.add_focus = action.focus;
          }}
          onChange={(value) => {
            // if (onChange) {
            //   onChange(value);
            // }
          }}
          content={field.label}
        />
      </>
    );
  }
  return (
    <div
      className={cx("expr expr-field", typeof value === "undefined" && "empty")}
    >
      {content}
    </div>
  );
};
