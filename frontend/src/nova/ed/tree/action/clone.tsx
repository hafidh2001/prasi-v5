import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { fillID } from "logic/fill-id";
import { deepClone } from "utils/react/use-global";
import { IItem } from "utils/types/item";

export const edActionClone = (p: PG, item: IItem) => {
  getActiveTree(p).update(({ findNode, tree }) => {
    const node = findNode(item.id);
    if (node) {
      if (node.parent) {
        const parent = findNode(node.parent.id);
        if (parent) {
          let idx = 0;
          for (const child of parent.item.childs) {
            if (child.id === item.id) {
              const new_item = fillID(deepClone(item));
              parent.item.childs.splice(idx, 0, new_item);
              break;
            }
            idx++;
          }
        }
      } else if (node.item.type === "section") {
        const idx = tree.childs.findIndex((e) => e.id === item.id);
        if (idx >= 0) {
          const new_item = fillID(deepClone(item));
          tree.childs.splice(idx, 0, new_item);
        }
      }
    }
  });
};
