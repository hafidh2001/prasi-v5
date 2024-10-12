import { EventHandler, FC, forwardRef, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { PExpr } from "../lib/types";
import { Popover } from "utils/ui/popover";
import ContentEditable from "react-contenteditable";
import { EdExprList } from "./expr-parts-list";

export const EdExprAdd = forwardRef<
  HTMLDivElement,
  { onAdd: (value: PExpr) => void }
>((props, ref) => {
  const local = useLocal({ open: false, filter: "" });
  return (
    <Popover
      content={<EdExprList filter={local.filter} />}
      asChild
      open={local.open}
      onOpenChange={(open) => {
        local.open = open;
        local.render();
      }}
    >
      <div
        ref={ref}
        className="input outline-none m-1 border-transparent border-2 focus:border-blue-600 px-1 rounded-sm"
        spellCheck={false}
        role="textbox"
        contentEditable
        onFocus={() => {
          if (!local.open) {
            local.open = true;
            local.render();
          }
        }}
        onInput={(e) => {
          local.filter = e.currentTarget.textContent || "";
          local.render();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Tab") {
            e.preventDefault();
            if (e.key === "Enter") {
              local.filter = "";
              e.currentTarget.innerHTML = "";
              local.render();
            }
          }
        }}
      />
    </Popover>
  );
});
