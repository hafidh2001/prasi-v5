import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { PExpr } from "./lib/types";
import { ExprPartAdd } from "./parts/expr-parts-add";
import { ExprPartsField } from "./parts/expr-parts-field";

export const EdExprEditorBody: FC<{
  value?: PExpr;
  onChange: (value: PExpr) => void;
  item_id: string;
}> = ({ value, onChange, item_id }) => {
  const local = useLocal({ add_focus: () => {} });
  const root = { expr: { value }, kind: "expr", name: "" } as PExpr;
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className={cx(
        "w-full select-none text-[93%] h-full cursor-pointer flex flex-start justify-start flex-wrap content-start items-center p-1 overflow-auto",
        css`
          font-family: "Liga Menlo", monospace;

          span {
            padding: 0px 5px;
          }

          .expr-kind,
          .expr-add,
          .expr-field,
          .expr-body {
            display: flex;
            align-items: center;
            flex-direction: row;
            border: 1px solid transparent;
            justify-content: center;
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
            border: 1px solid #fafafa;
            width: 100%;
            height: 100%;
            flex: 1;
            padding: 1px;
            align-items: stretch;
            justify-content: flex-start;

            > span {
              display: flex;
              align-items: center;
            }

            &.focus {
              border: 1px solid blue;
              outline: 1px solid blue;
              background: #f0f3ff;
            }
          }

          > .expr-body {
            border: 0;
            justify-content: flex-start;
            align-items: center;
            align-content: start;
          }

          .expr-field {
            padding: 0px;
            &.empty {
              border: 1px solid #ccc;
              color: #999;
              > * {
                flex: 1;
                height: 100%;
              }
            }
            > .expr-body {
              > .empty {
                border-color: transparent;

                > * {
                  flex: 1;
                  height: 100%;
                }
              }
            }

            & > {
              /* &:hover {
                border: 1px solid blue;
              } */
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

          .expr-static {
            border: 1px solid #ccc;
            border-radius: 2px;
            display: flex;
            .type-label {
              border-right: 1px solid #ccc;
              color: #999;
            }
            &:hover,
            .focus {
              .type-label {
                background: blue;
                color: white;
              }
            }
            .input {
              flex: 1;
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
          disabled
          content="<div style='color:#999;'>Add Expression</div>"
        />
      )}
      {root.kind === "expr" && (
        <ExprPartsField
          value={root}
          name={"value"}
          def={{ fields: { value: { kind: "expression" } } }}
          onChange={(value) => {
            if (value.kind === "expr") onChange(value.expr.value);
          }}
        />
      )}
    </div>
  );
};
