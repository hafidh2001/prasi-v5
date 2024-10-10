import { PNode } from "logic/types";
import { IVar, VarUsage } from "utils/types/item";

export const getVarUsage = (
  v: IVar<any>,
  findNode: (id: string) => null | PNode
) => {
  const result = [] as { usage: VarUsage; place: "loop" }[];

  for (const [item_id, usage] of Object.entries(v.usage)) {
    if (usage.loop) {
      const n = findNode(item_id);
      if (n && n.item.loop?.var) {
        result.push({ usage: n.item.loop.var, place: "loop" });
      }
    }
    if (usage.content) {
      const n = findNode(item_id);
      if (n && n.item.content?.var) {
        result.push({ usage: n.item.content.var, place: "loop" });
      }
    }
  }
  return result;
};
