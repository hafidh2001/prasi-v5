import { PNode } from "logic/types";
import { IVar, VarUsage } from "utils/types/item";

export const getVarUsage = (
  v: IVar<any>,
  findNode: (id: string) => null | PNode
) => {
  const result = [] as {
    item_id: string;
    usage: VarUsage;
    place: "loop" | "content";
  }[];

  for (const [item_id, usage] of Object.entries(v.usage)) {
    if (usage.loop) {
      const n = findNode(item_id);
      if (n && n.item.loop?.var) {
        const _var = n.item.loop?.var;
        if (_var.var_id === v.id) {
          result.push({
            item_id: n.item.id,
            usage: n.item.loop.var,
            place: "loop",
          });
        }
      }
    }
    if (usage.content) {
      const n = findNode(item_id);
      if (n && n.item.content?.var) {
        const _var = n.item.content?.var;

        if (_var.var_id === v.id) {
          result.push({
            item_id: n.item.id,
            usage: n.item.content.var,
            place: "content",
          });
        }
      }
    }
  }
  return result;
};
