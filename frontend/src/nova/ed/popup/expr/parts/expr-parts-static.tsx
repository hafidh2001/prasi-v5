import { ESimpleType } from "popup/vars/lib/type";
import { EdTypeLabel } from "popup/vars/lib/type-label";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { Switch } from "utils/shadcn/comps/ui/switch";
import { Popover } from "utils/ui/popover";
import { ExprBackdrop, PExpr } from "../lib/types";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartsStatic: FC<{
  type: ESimpleType;
  value?: { kind: "static"; value?: any; type: ESimpleType };
  onChange: (value: PExpr) => void;
}> = ({ type, value, onChange }) => {
  const local = useLocal({
    open: false,
    value: (value?.value || "") as any,
    action: {} as
      | {
          selectNext: () => void;
          selectPrev: () => void;
          pick: () => void;
        }
      | undefined,
    timeout: null as any,
  });

  const content = (
    <div
      className="flex items-stretch flex-1"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <EdTypeLabel
        type={type}
        onClick={() => {
          local.open = true;
          local.render();
        }}
      />
      {type === "boolean" ? (
        <div
          className={cx(
            "px-2 py-[3px] flex-1 uppercase flex items-center border-purple-500 border rounded-[2px] m-[2px]",
            !!local.value ? "text-green-700" : "text-red-700"
          )}
          onClick={() => {
            local.value = !local.value as any;
            onChange({
              ...value,
              kind: "static",
              type: "boolean",
              value: local.value,
            });
            local.render();
          }}
        >
          {JSON.stringify(!!local.value)}
        </div>
      ) : (
        <input
          value={local.value}
          className="outline-none input px-1 py-[3px] border-purple-500 border rounded-[2px] m-[2px]"
          spellCheck={false}
          onBlur={() => {
            onChange({
              ...value,
              kind: "static",
              type: value?.type || "string",
              value: local.value,
            });
          }}
          onChange={(e) => {
            const text = e.currentTarget.value;
            local.value = text;
            local.render();
          }}
        />
      )}
    </div>
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
