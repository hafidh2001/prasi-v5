import { forwardRef } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { PExpr } from "../lib/types";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartAdd = forwardRef<
  HTMLDivElement,
  {
    onChange: (value: PExpr) => void;
    bind?: (arg: { focus: () => void }) => void;
  }
>(({ bind, onChange }, ref) => {
  const local = useLocal({
    open: false,
    filter: { text: "" },
    action: undefined as
      | {
          selectNext: () => void;
          selectPrev: () => void;
          pick: () => void;
        }
      | undefined,
    placeholder: "Empty",
    div_ref: null as null | HTMLDivElement,
  });

  if (bind) {
    bind({
      focus() {
        if (local.div_ref) {
          local.div_ref.focus();
        }
      },
    });
  }

  return (
    <Popover
      content={
        <ExprPartList
          filter={local.filter.text}
          bind={(action) => {
            local.action = action;
          }}
          onChange={(expr) => {
            console.log("expr", expr);
            if (local.open) {
              local.open = false;
              local.render();
            }
            onChange({ name: expr.name, expr: {}, kind: "expr" });
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
        ref={(r) => {
          if (typeof ref === "function") {
            ref(r);
          } else if (typeof ref === "object" && ref) {
            ref.current = r;
          }

          if (r) local.div_ref = r;
        }}
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
          local.filter.text = e.currentTarget.textContent || "";
          local.render();
        }}
        onBlur={(e) => {
          e.currentTarget.innerHTML = "";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Tab") {
            e.preventDefault();
            if (e.key === "Enter") {
              if (local.action?.pick()) {
                e.currentTarget.blur();
                local.open = false;
                local.render();
              }
            }
          }
        }}
      />
    </Popover>
  );
});
