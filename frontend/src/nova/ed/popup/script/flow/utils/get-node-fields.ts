import { allNodeDefinitions } from "../runtime/nodes";
import { DeepReadonly, PFNode, PFNodeDefinition } from "../runtime/types";
import { getNodeDef } from "./get-node-def";

export const getNodeFields = (node: DeepReadonly<PFNode>) => {
  const data = {} as Record<string, any>;

  const def = getNodeDef(node.type);

  if (def) {
    for (const key of Object.keys(def.fields || {})) {
      data[key] = node[key];
    }
    return { data, definition: def as PFNodeDefinition<any> };
  }
};
