import { ESimpleType } from "popup/vars/lib/type";
import { EdTypeLabel } from "popup/vars/lib/type-label";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartsStatic: FC<{ type: ESimpleType; value: any }> = ({
  type,
  value,
}) => {
  const local = useLocal({
    open: false,
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
      <input value={value} className="outline-none input" onChange={() => {}} />
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
      backdrop={false}
      content={
        <ExprPartList
          selected={type}
          onChange={(e) => {
            console.log(e);
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
