import { MonacoJS } from "popup/script/code/monaco-js";
import { FC } from "react";
import { debounce } from "utils/script/debounce";
import { jscript } from "utils/script/jscript";
import { DeepReadonly, PFField, PFNode } from "../runtime/types";
import { Resizable } from "re-resizable";

export const PFPropCode: FC<{
  field: PFField;
  node: DeepReadonly<PFNode>;
  value: string;
  error?: string;
  update: (value: string, valueBuilt: string, errors: string) => void;
}> = ({ field, value, update }) => {
  if (field.type !== "code") return null;
  return (
    <Resizable
      defaultSize={{
        height:
          parseInt(localStorage.getItem("prasi-flow-code-height") || "") || 100,
      }}
      maxWidth={700}
      minWidth={700}
      boundsByDirection
      className={cx(css`
        min-width: 700px;
        min-height: 100px;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        contain: "contents";
        > section {
          flex: 1;
          width: auto !important;
          height: auto !important;
        }
        resize: both;
        border: 2px solid white;
      `)}
      onResizeStop={(_, __, div) => {
        localStorage.setItem(
          "prasi-flow-code-height",
          div.clientHeight.toString()
        );
      }}
    >
      <MonacoJS
        nolib
        className={cx(css`
          .monaco-editor {
            border: 0px;
            outline: none;
          }
        `)}
        activeModel="prasi:///active.tsx"
        onChange={async ({ value }) => {
          const src = value;
          if (src) {
            let built = "";
            let errors = "";
            try {
              const transform = jscript.transform!;
              const res = await transform(src, {
                jsx: "transform",
                logLevel: "silent",
                format: "cjs",
                loader: "tsx",
              });
              built = res.code;
            } catch (e: any) {
              const formatError = jscript.formatMessages!;

              errors = (await formatError(e.errors, { kind: "error" })).join(
                "\n\n"
              );
            }
            update(src, built, errors);
          } else {
            update("", "", "");
          }
        }}
        models={[
          {
            name: "prasi:///active.tsx",
            source: value,
          },
        ]}
        onAfterMount={(editor) => {
          editor.focus();
        }}
      />
    </Resizable>
  );
};
