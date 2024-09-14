import { createId } from "@paralleldrive/cuid2";
import { activateItem, active, getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";

export const edActionAdd = async (p: PG, item: IItem) => {
  const new_item: IItem = {
    id: createId(),
    name: `new_item`,
    type: "item",
    childs: [],
  };
  getActiveTree(p).update(({ findNode }) => {
    const node = findNode(item.id);
    if (node) {
      if (item.type === "text") {
        if (node.parent) {
          const parent = findNode(node.parent.id);
          if (parent) {
            let idx = 0;
            for (const child of parent.item.childs) {
              if (child.id === item.id) {
                parent.item.childs.splice(idx + 1, 0, new_item);
                break;
              }
              idx++;
            }
          }
        }
      } else {
        node.item.childs.push(new_item);
      }
    }
  });

  activateItem(p, new_item.id);
};
