import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import {
  EOutputType,
  ExprBackdrop,
  ExprComponent,
  PExpr,
  PTypedExpr,
} from "../lib/types";
import { allExpression } from "./all-expr";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartBody: FC<{
  value: PTypedExpr<any>;
  parent?: { value: PExpr; name: string };
  onChange: (value: PExpr) => void;
  expected_type?: EOutputType[];
}> = ({ value, expected_type, onChange, parent }) => {
  const local = useLocal({ open: false, content: null as any });
  const { name } = value;
  const def = allExpression.find((d) => {
    if (d.name === name) {
      if (expected_type && expected_type.length > 0 && d.output_type) {
        if (expected_type.includes(d.output_type) || d.output_type === "any") {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  });

  if (!local.content) {
    if (!def) {
      local.content = <>NO DEF: {name} </>;
    } else {
      const Component = (def.Component as ExprComponent<any>).bind(def);
      local.content = (
        <Component
          value={value}
          onChange={(val) => {
            local.content = null;
            onChange(val);
          }}
          onFocusChange={
            parent
              ? (focus: boolean) => {
                  local.open = focus;
                  local.render();
                }
              : undefined
          }
          expected_type={expected_type}
        />
      );
    }
  }

  if (parent && parent.value.kind === "expr") {
    return (
      <Popover
        backdrop={ExprBackdrop}
        asChild
        open={local.open}
        onOpenChange={(open) => {
          local.open = open;
          local.render();
        }}
        content={
          <ExprPartList
            selected={value.name}
            onChange={(item) => {
              local.open = false;
              local.content = null;
              onChange(item);
            }}
          />
        }
      >
        <div
          className={cx(`expr expr-body space-x-[2px]`, local.open && "focus")}
          onClick={(e) => {
            e.stopPropagation();
            local.open = true;
            local.render();
          }}
        >
          {local.content}
        </div>
      </Popover>
    );
  }
  return (
    <div className={cx(`expr expr-body space-x-[2px]`)}>{local.content}</div>
  );
};
