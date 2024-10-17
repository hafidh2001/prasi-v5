import { ESimpleType } from "popup/vars/lib/type";
import { EdTypeLabel } from "popup/vars/lib/type-label";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { ExprPartList } from "./expr-parts-list";
import { ExprBackdrop, PExpr } from "../lib/types";

export const ExprPartsStatic: FC<{
  type: ESimpleType;
  value: any;
  onChange: (value: PExpr) => void;
}> = ({ type, value, onChange }) => {
  const local = useLocal({
    open: false,
    value: "",
    action: {} as
      | {
          selectNext: () => void;
          selectPrev: () => void;
          pick: () => void;
        }
      | undefined,
  });

  const content = (
    <>
      <EdTypeLabel
        type={type}
        onClick={() => {
          local.open = true;
          local.render();
        }}
      />
      <input
        value={local.value}
        className="outline-none input"
        spellCheck={false}
        onChange={(e) => {
          const text = e.currentTarget.value;
          local.value = text;
          local.render();
        }}
      />
    </>
  );

  if (!local.open) {
    return <div className={cx("expr expr-static")}>{content}</div>;
  }

  return (
    <Popover
      className={cx("expr expr-static focus")}
      open
      onOpenChange={(open) => {
        local.open = open;
        local.render();
      }}
      backdrop={ExprBackdrop}
      content={
        <ExprPartList
          selected={"static"}
          onChange={(e) => {
            onChange(e);
            local.open = false;
            local.render();
          }}
          bind={(act) => (local.action = act)}
        />
      }
    >
      {content}
    </Popover>
  );
};
