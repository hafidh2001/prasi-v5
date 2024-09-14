import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";

export const edActionUnwrap = (p: PG, item: IItem) => {
  getActiveTree(p).update(({ findParent }) => {
    const parent = findParent(item.id);
    if (parent) {
      let i = 0;
      for (const child of parent.item.childs) {
        if (child.id === item.id) {
          if (item.type === "item" && item.childs.length > 0) {
            parent.item.childs.splice(i, 1, ...item.childs);
          }
        }
        i++;
      }
    }
  });
};
