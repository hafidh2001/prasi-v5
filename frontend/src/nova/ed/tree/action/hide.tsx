import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";

export const edActionHide = (
  p: PG,
  item: IItem,
  mode = "toggle" as "toggle" | "switch"
) => {
  getActiveTree(p).update("Toggle item hidden", ({ findNode }) => {
    const node = findNode(item.id);
    if (node) {
      if (!node.item.hidden) node.item.hidden = "all";
      else delete node.item.hidden;
    }
  });
};
