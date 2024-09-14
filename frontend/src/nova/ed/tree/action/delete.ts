import { active, getActiveTree } from "logic/active";
import { IItem } from "../../../../utils/types/item";
import { PG } from "../../logic/ed-global";

export const edActionDelete = async (p: PG, item: IItem) => {
  getActiveTree(p).update(({ findNode }) => {
    const node = findNode(item.id);
    if (node?.parent) {
      const parent = findNode(node.parent.id);
      if (parent) {
        parent.item.childs = [
          ...parent.item.childs.filter((e) => e.id !== item.id),
        ];
      }
    }
  });
};

export const edActionDeleteById = async (p: PG, id: string) => {
  getActiveTree(p).update(({ findNode }) => {
    const node = findNode(id);
    if (node?.parent) {
      const parent = findNode(node.parent.id);
      if (parent) {
        parent.item.childs = [...parent.item.childs.filter((e) => e.id !== id)];
      }
    }
  });
};
