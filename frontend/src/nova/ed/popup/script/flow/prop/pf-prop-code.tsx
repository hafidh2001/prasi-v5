import { MonacoJS } from "popup/script/code/monaco-js";
import { FC } from "react";
import { debounce } from "utils/script/debounce";
import { jscript } from "utils/script/jscript";
import { DeepReadonly, PFField, PFNode } from "../runtime/types";

export const PFPropCode: FC<{
  field: PFField;
  node: DeepReadonly<PFNode>;
  name: string;
  update: (value: string, valueBuilt: string, errors: string) => void;
}> = ({ field, node, name, update }) => {
  if (field.type !== "code") return null;
  const value = node[name];
  return (
    <div
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
      `)}
    >
      <MonacoJS
        nolib
        value={value}
        className={cx(css`
          .monaco-editor {
            border: 0px;
            outline: none;
          }
        `)}
        onChange={debounce(async (src) => {
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
        })}
        onMount={(editor) => {
          editor.focus();
        }}
      />
    </div>
  );
};
