import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { ExprPartAdd } from "./parts/expr-parts-add";

export const EdExprEditorBody: FC<{}> = () => {
  const local = useLocal({ add_focus: () => {} });
  return (
    <div
      className="w-full h-full cursor-pointer flex flex-start justify-start flex-wrap content-start items-center"
      onClick={() => {
        local.add_focus();
      }}
    >
      <div className="w-[200px] h-[30px] bg-red-500"></div>
      <ExprPartAdd
        bind={(action) => {
          local.add_focus = action.focus;
        }}
        onChange={(value) => {}}
      />
    </div>
  );
};
