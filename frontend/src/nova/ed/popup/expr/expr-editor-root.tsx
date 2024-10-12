import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { ExprPartAdd } from "./parts/expr-parts-add";
import { PExpr } from "./lib/types";

export const EdExprEditorRoot: FC<{}> = () => {
  const local = useLocal({ add_focus: () => {}, value: null as null | PExpr });
  return (
    <div
      className="w-full h-full cursor-pointer flex flex-start justify-start flex-wrap content-start items-center"
      onClick={() => {
        local.add_focus();
      }}
    >
      {!local.value && (
        <ExprPartAdd
          bind={(action) => {
            local.add_focus = action.focus;
          }}
          onChange={(value) => {
            console.log(value);
            local.value = value;
            local.render();
          }}
        />
      )}
      {local.value && <>asda</>}
    </div>
  );
};
