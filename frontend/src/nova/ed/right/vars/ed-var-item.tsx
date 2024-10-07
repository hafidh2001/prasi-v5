import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import { Trash2 } from "lucide-react";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { Tooltip } from "utils/ui/tooltip";

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
          "px-1 flex-1 flex items-center relative",
          css`
            min-width: 80px;
          `
        )}
      >
        <div className="flex-1 my-1">{name}</div>
      </div>

      {_var && (
        <Tooltip
          content="Delete Variable"
          onClick={() => {
            getActiveTree(p).update(
              `Remove Variable ${name}`,
              ({ findNode }) => {
                const n = findNode(node.item.id);
                if (n) {
                  if (!n.item.vars) {
                    n.item.vars = {};
                  }
                  delete n.item.vars[name];
                }
              }
            );
          }}
          className="del flex items-center justify-center w-[25px] border-l cursor-pointer hover:bg-red-500 hover:text-white"
        >
          <Trash2 size={14} />
        </Tooltip>
      )}
    </div>
  );
};
