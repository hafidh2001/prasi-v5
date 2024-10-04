import { nodeCode } from "./nodes/code";
import { nodeBranch } from "./nodes/branch";
import { nodeStart } from "./nodes/start";
import { nodeReactOutput } from "./nodes/react-output";
import { nodeReactRender } from "./nodes/react-render";

export const allNodeDefinitions = {
  start: nodeStart,
  code: nodeCode,
  branch: nodeBranch,
  reactOutput: nodeReactOutput,
  reactRender: nodeReactRender,
};
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
