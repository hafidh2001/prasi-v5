import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartsStatic: FC<{ children: any; type: string }> = ({
  children,
  type,
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

  if (!local.open) {
    return (
      <div
        className={cx("expr expr-kind expr-static")}
        onClick={() => {
          local.open = true;
          local.render();
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <Popover
      className={cx("expr expr-kind expr-static focus")}
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
      {children}
    </Popover>
  );
};
