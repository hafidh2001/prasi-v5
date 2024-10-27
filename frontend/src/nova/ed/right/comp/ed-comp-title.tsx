import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { List, TableProperties } from "lucide-react";
import { useGlobal } from "utils/react/use-global";
import { formatItemName } from "../../tree/parts/node/node-name";

export const EdCompTitle = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const node = getActiveNode(p);

  let name = node?.item.name;

  return (
    <div
      className={cx(
        "px-2 mt-[3px] flex items-center h-[27px] border cursor-pointer hover:text-blue-600 border-b-0 text-xs -mb-[1px] capitalize rounded-t-sm",
        "bg-white",
        css`
          svg {
            width: 12px;
            height: 12px;
            margin-right: 3px;
          }
        `
      )}
    >
      <List />
      {formatItemName(name || "")}
    </div>
  );
};
