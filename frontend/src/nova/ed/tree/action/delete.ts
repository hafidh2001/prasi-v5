import { getActiveTree } from "logic/active";
import { IItem } from "../../../../utils/types/item";
import { PG } from "../../logic/ed-global";

export const edActionDelete = async (p: PG, item: IItem) => {
  getActiveTree(p).update("Delete item", ({ findNode, tree }) => {
    const node = findNode(item.id);
    if (node) {
      if (node.parent) {
        const parent = findNode(node.parent.id);
        if (parent) {
          parent.item.childs = [
            ...parent.item.childs.filter((e) => e.id !== item.id),
          ];
        }
      } else {
        const idx = tree.childs.findIndex((e) => e.id === item.id);
        if (idx >= 0) {
          tree.childs.splice(idx, 1);
        }
      }
    }
  });
};

export const edActionDeleteById = async (p: PG, id: string) => {
  getActiveTree(p).update("Delete item", ({ findNode }) => {
    const node = findNode(id);
    if (node?.parent) {
      const parent = findNode(node.parent.id);
      if (parent) {
        parent.item.childs = [...parent.item.childs.filter((e) => e.id !== id)];
      }
    }
  });
};
