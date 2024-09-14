import { createId } from "@paralleldrive/cuid2";
import { activateItem, active, getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";

export const edActionAdd = async (p: PG) => {
  const new_item: IItem = {
    id: createId(),
    name: `new-item`,
    type: "item",
    childs: [],
  };
  getActiveTree(p).update(({ findNode, tree }) => {
    if (active.item_id) {
      const node = findNode(active.item_id);
      if (node) {
        if (
          node.item.type === "text" ||
          (node.item.type === "item" &&
            node.item.component?.id &&
            active.comp?.id !== node.item.component.id)
        ) {
          if (node.parent) {
            const parent = findNode(node.parent.id);
            if (parent) {
              let idx = 0;
              for (const child of parent.item.childs) {
                if (child.id === node.item.id) {
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
    } else {
      tree.childs.push({ ...new_item, type: "section", name: "section" });
    }
  });

  activateItem(p, new_item.id);
};
