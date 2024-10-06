import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";

export const EdVarItem: FC<{ name: string; node: PNode }> = ({
  name,
  node,
}) => {
  const p = useGlobal(EDGlobal, "GLOBAL");
  const vars = node.item.vars || {};
  const _var = vars[name];
  if (!_var) return null;

  return (
    <div
      className={cx(
        "border-b flex text-sm flex-stretch select-none",
        css`
          min-height: 24px;
        `
      )}
    >
      <div
        className={cx(
          "px-1 flex items-center relative",
          css`
            min-width: 80px;
          `
        )}
      >
        <div className="flex-1 my-1">{name}</div>
      </div>
    </div>
  );
};
