import { allNodeDefinitions } from "../runtime/nodes";
import { PFNodeDefinition } from "../runtime/types";

export const getNodeDef = (type: string) => {
  const found = Object.entries(allNodeDefinitions).find(
    ([k, e]) => k === type || e.type === type
  );
  if (found) {
    return found[1] as PFNodeDefinition<any>;
  }
};
