import { FC } from "react";
import { PExpr, PExprDefinition, PExprField } from "../lib/types";
import { ExprPartAdd } from "./expr-parts-add";
import { ExprPartBody } from "./expr-parts-body";
import { ExprPartsStatic } from "./expr-parts-static";

export const ExprPartsField: FC<{
  name: string;
  value: PExpr;
  def: PExprDefinition<any>;
}> = ({ name, value, def }) => {
  const field = def.fields[name] as PExprField;
  if (!field) return null;
  let content = null;
  if (field.kind === "expression") {
    if (typeof value === "undefined") {
      content = (
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
          disabled
        />
      );
    } else {
      if (value.kind === "expr") {
        content = <ExprPartBody expr={value.expr} name={value.name} />;
      } else if (value.kind === "static") {
        content = (
          <ExprPartsStatic type={value.type}>
            <>
              {["string", "number"].includes(typeof value.value)
                ? value.value + ""
                : JSON.stringify(value)}
            </>
          </ExprPartsStatic>
        );
      }
    }
  }

  return (
    <div
      className={cx("expr expr-field", typeof value === "undefined" && "empty")}
    >
      {content}
    </div>
  );
};
