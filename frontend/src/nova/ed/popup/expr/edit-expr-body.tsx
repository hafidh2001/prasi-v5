import { FC, forwardRef, useRef } from "react";
import { useLocal } from "utils/react/use-local";
import { PExpr } from "./lib/types";
import { EdExprAdd } from "./parts/expr-parts-add";

export const EdExprEditorBody: FC<{}> = () => {
  const local = useLocal({});
  const add_ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className="w-full h-full cursor-text flex flex-start justify-start flex-wrap content-start items-center"
      onClick={() => {
        add_ref.current?.focus();
      }}
    >
      <div className="w-[200px] h-[30px] bg-red-500"></div>
      <EdExprAdd ref={add_ref} onAdd={(value) => {}} />
    </div>
  );
};
