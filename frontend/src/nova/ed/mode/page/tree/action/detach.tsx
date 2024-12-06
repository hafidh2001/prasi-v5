import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { deepClone } from "utils/react/use-global";
import { IItem } from "utils/types/item";

export const edActionDetach = (p: PG, item: IItem) => {
  getActiveTree(p).update("Detach component", ({ findParent }) => {
    const parent = findParent(item.id);
    if (parent) {
      let i = 0;
      for (const child of parent.item.childs) {
        if (child.id === item.id && item.component) {
          const new_item = deepClone(
            p.comp.loaded[item.component.id].content_tree
          );
          delete new_item.component;
          new_item.childs = new_item.childs.filter(
            (e) => !e.name.startsWith("jsx:")
          );
          parent.item.childs.splice(i, 1, new_item);
          break;
        }
        i++;
      }
    }
  });
};
