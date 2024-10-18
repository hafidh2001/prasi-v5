import { active } from "logic/active";
import { RectangleEllipsis } from "lucide-react";
import { EdVarLabel } from "popup/vars/lib/var-label";
import { EdVarPicker } from "popup/vars/picker/picker-var";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { VarUsage } from "utils/types/item";
import { Popover } from "utils/ui/popover";
import { ExprBackdrop, PExpr } from "../lib/types";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartsVar: FC<{
  value?: VarUsage;
  onChange: (value: PExpr) => void;
}> = ({ value, onChange }) => {
  const local = useLocal({
    openExpr: false,
    openVar: false,
    action: {} as
      | {
          selectNext: () => void;
          selectPrev: () => void;
          pick: () => void;
        }
      | undefined,
  });

  const content = (
    <div
      className={cx(
        "flex items-stretch",
        (local.openExpr || local.openVar) &&
          "bg-blue-100 outline-blue-600 outline rounded-[2px]"
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {!value && (
        <div
          className="flex items-center border-r-[#ccc] justify-center p-1 hover:bg-blue-600 hover:border-r-blue-600 hover:text-white border-r"
          onClick={() => {
            local.openExpr = true;
            local.render();
          }}
        >
          <RectangleEllipsis size={18} strokeWidth={1.5} />
        </div>
      )}

      <EdVarPicker
        value={value}
        onChange={(_var) => {
          onChange({ kind: "var", var: _var });
        }}
        open={local.openVar}
        onOpenChange={(open) => {
          local.openVar = open;
          local.render();
        }}
        item_id={active.item_id}
      >
        <div className="flex flex-1">
          <EdVarLabel
            value={value}
            onIconClick={(e) => {
              e.stopPropagation();
              local.openExpr = true;
              local.render();
            }}
            labelClassName="py-1"
            className="flex items-stretch space-x-1 pr-[5px] flex-1"
            empty={
              <div className="flex items-stretch px-[5px] flex-1">
                <div className="flex items-center justify-center">
                  Pick Variable
                </div>
              </div>
            }
          />
        </div>
      </EdVarPicker>
    </div>
  );

  if (!local.openExpr) {
    return <div className={cx("expr expr-static")}>{content}</div>;
  }

  return (
    <Popover
      className={cx("expr expr-static focus")}
      open
      onOpenChange={(open) => {
        local.openExpr = open;
        local.render();
      }}
      backdrop={ExprBackdrop}
      content={
        <ExprPartList
          selected={"var"}
          onChange={(e) => {
            onChange(e);
            local.openExpr = false;
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
