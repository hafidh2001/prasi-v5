import { nodeCode } from "./nodes/code";
import { nodeBranch } from "./nodes/branch";
import { nodeStart } from "./nodes/start";
import { nodeItemRender } from "./nodes/item-render";

export const allNodeDefinitions = {
  start: nodeStart,
  code: nodeCode,
  branch: nodeBranch,
  itemRender: nodeItemRender,
};
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
