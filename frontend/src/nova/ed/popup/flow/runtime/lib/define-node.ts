import { PFNodeDefinition } from "../types";

export const defineNode = <T extends Record<string, any>, J extends Record<string, any>>(
  node: PFNodeDefinition<{ [K in keyof T]: any }, J>
) => {
  return node;
};
