import { FC, forwardRef, useRef } from "react";
import { useLocal } from "utils/react/use-local";
import { PExpr } from "./lib/types";
import { EXTrigger } from "./parts/expr-parts-trigger";

export const EdExprEditorBody: FC<{}> = () => {
  const local = useLocal({});
  const add_ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className="w-full h-full cursor-pointer flex flex-start justify-start flex-wrap content-start items-center"
      onClick={() => {
        add_ref.current?.focus();
      }}
    >
      <div className="w-[200px] h-[30px] bg-red-500"></div>
      <EXTrigger ref={add_ref} onChange={(value) => {}} />
    </div>
  );
};
