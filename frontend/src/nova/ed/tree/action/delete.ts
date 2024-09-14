import { active, getActiveTree } from "logic/active";
import { IItem } from "../../../../utils/types/item";
import { PG } from "../../logic/ed-global";

export const edActionDelete = async (p: PG, item: IItem) => {
  getActiveTree(p).update(({ findById }) => {
    const node = findById(item.id);
    if (node?.parent) {
      const parent = findById(node.parent.id);
      if (parent) {
        parent.item.childs = [
          ...parent.item.childs.filter((e) => e.id !== item.id),
        ];
      }
    }
  });
};

export const edActionDeleteById = async (p: PG, id: string) => {
  getActiveTree(p).update(({ findById }) => {
    const node = findById(id);
    if (node?.parent) {
      const parent = findById(node.parent.id);
      if (parent) {
        parent.item.childs = [...parent.item.childs.filter((e) => e.id !== id)];
      }
    }
  });
};
