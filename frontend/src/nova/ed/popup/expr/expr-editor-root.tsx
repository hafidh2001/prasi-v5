import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { ExprPartAdd } from "./parts/expr-parts-add";
import { PExpr } from "./lib/types";
import { ExprPartBody } from "./parts/expr-parts-body";

export const EdExprEditorRoot: FC<{
  value?: PExpr;
  onChange?: (value: PExpr) => void;
}> = ({ value, onChange }) => {
  const local = useLocal({ add_focus: () => {} });
  return (
    <div
      className={cx(
        "w-full h-full cursor-pointer flex flex-start justify-start flex-wrap content-start items-center",
        css`
          .expr-body {
            &.hover {
              border: 1px solid #ccc;
            }
            .expr-kind {
              padding: 0px 5px;
            }
          }
        `
      )}
      onClick={() => {
        local.add_focus();
      }}
    >
      {!value && (
        <ExprPartAdd
          bind={(action) => {
            local.add_focus = action.focus;
          }}
          onChange={(value) => {
            if (onChange) {
              onChange(value);
            }
          }}
        />
      )}
      {value && value.kind === "expr" && (
        <ExprPartBody name={value.name} expr={value.expr} />
      )}
    </div>
  );
};
