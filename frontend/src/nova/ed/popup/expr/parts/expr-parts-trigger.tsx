import { forwardRef } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { PExpr } from "../lib/types";
import { EdExprList } from "./expr-parts-list";

export const EXTrigger = forwardRef<
  HTMLDivElement,
  { onChange: (value: PExpr) => void }
>((props, ref) => {
  const local = useLocal({
    open: false,
    filter: "",
    action: undefined as
      | {
          selectNext: () => void;
          selectPrev: () => void;
          pick: () => void;
        }
      | undefined,
    placeholder: "",
  });
  return (
    <Popover
      content={
        <EdExprList
          filter={local.filter}
          bind={(action) => {
            local.action = action;
          }}
          onChange={(expr) => {
            console.log(expr);

            if (local.open) {
              local.open = false;
              local.render();
            }
          }}
        />
      }
      asChild
      open={local.open}
      onOpenChange={(open) => {
        local.open = open;
        local.render();
      }}
    >
      <div
        ref={ref}
        className={cx(
          "input outline-none m-1 border-transparent border-2 min-w-[50px] focus:border-blue-600 px-1 rounded-sm",
          !local.open && "cursor-pointer hover:border-blue-600"
        )}
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
        onBlur={(e) => {
          e.currentTarget.innerHTML = "";

          setTimeout(() => {
            local.filter = "";
            local.open = false;
            local.render();
          });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Tab") {
            e.preventDefault();
            if (e.key === "Enter") {
              if (local.action?.pick()) {
                e.currentTarget.blur();
              }
            }
          }
        }}
      />
    </Popover>
  );
});
