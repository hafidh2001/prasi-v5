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
        "w-full select-none text-sm h-full cursor-pointer flex flex-start justify-start flex-wrap content-start items-center",
        css`
          font-family: "Liga Menlo", monospace;

          .expr-static {
            color: purple;
          }

          span {
            padding: 0px 5px;
          }

          .expr-kind,
          .expr-add,
          .expr-static,
          .expr-field,
          .expr-body {
            display: flex;
            align-items: center;
            flex-direction: row;
            border: 1px solid transparent;
            justify-content: center;
            align-content: start;
            flex-wrap: wrap;
            border-radius: 2px;
            outline: none;
            padding: 0px 5px;
          }

          .expr-kind,
          .expr-add {
            white-space: nowrap;
            &:hover {
              border: 1px solid blue;
            }

            &.focus {
              border: 1px solid blue;
              outline: 1px solid blue;
            }
          }

          .expr-body {
            border: 1px solid #ccc;
            width: 100%;
            height: 100%;
            flex: 1;
            padding: 0px;
            padding-right: 1px;
          }

          > .expr-body {
            border: 0;
            justify-content: flex-start;
          }

          .expr-field {
            padding: 0px;
            &.empty {
              border: 1px solid #ccc;
              color: #999;
            }
            > .expr-body {
              > .empty {
                border-color: transparent;
              }
            }

            & > {
              &:hover {
                border: 1px solid blue;
              }
              &.focus {
                outline: 1px solid blue;
              }
              .expr-kind,
              .expr-add,
              .expr-static {
                margin: 0px;
              }
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
