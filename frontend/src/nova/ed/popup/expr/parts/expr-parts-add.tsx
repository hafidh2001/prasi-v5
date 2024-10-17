import { ESimpleType } from "popup/vars/lib/type";
import { forwardRef, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { ExprBackdrop, PExpr } from "../lib/types";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartAdd = forwardRef<
  HTMLDivElement,
  {
    onChange: (value: PExpr) => void;
    bind?: (arg: { focus: () => void }) => void;
    content?: string;
    open?: boolean;
    expected_type?: (ESimpleType | "any")[];
    disabled?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ bind, onChange, content, open, onOpenChange, disabled }, ref) => {
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
    div_ref: null as null | HTMLDivElement,
  });

  useEffect(() => {
    if (local.open !== open && typeof open === "boolean") {
      local.open = open;
      local.render();
    }
  }, [open]);

  useEffect(() => {
    if (content && local.div_ref) {
      local.div_ref.innerHTML = content;
    }
  }, [content]);

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
      backdrop={ExprBackdrop}
      content={
        <ExprPartList
          search={local.filter.text}
          bind={(action) => {
            local.action = action;
          }}
          onChange={(item) => {
            onChange(item);
            if (onOpenChange) {
              onOpenChange(false);
            } else {
              local.open = false;
              local.render();
            }
          }}
        />
      }
      asChild
      open={local.open}
      onOpenChange={(open) => {
        if (!open && local.div_ref === document.activeElement) {
          setTimeout(() => {
            if (local.div_ref !== document.activeElement) {
              if (onOpenChange) onOpenChange(false);
              else {
                local.open = false;
                local.render();
              }
            }
          });
          return;
        }
        if (onOpenChange) onOpenChange(open);
        else {
          local.open = open;
          local.render();
        }
      }}
      className={cx(
        "expr expr-add",
        local.open && "focus",
        disabled && "text-slate-400",
      )}
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
        spellCheck={false}
        contentEditable={disabled !== true}
        onClick={(e) => {
          e.stopPropagation();
          if (disabled) {
            if (!local.open) {
              local.open = true;
              local.render();
            }
          }
        }}
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
          e.currentTarget.innerHTML = content || "";
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
