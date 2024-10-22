import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { VarUsage } from "utils/types/item";

export const getVarDef = (p: PG, usage: VarUsage) => {
  const tree = getActiveTree(p).var_items[usage.var_id];
  return tree.var;
};
