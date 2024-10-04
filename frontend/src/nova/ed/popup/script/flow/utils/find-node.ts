import { current } from "immer";
import {
  DeepReadonly,
  PFlow,
  PFNode,
  PFNodeBranch,
  PFNodeID,
  RPFlow,
} from "../runtime/types";

export const immutableFindFlow = ({
  id,
  pflow,
  parent_id,
}: {
  id: string;
  pflow: RPFlow;
  parent_id?: string;
}) => {
  let result = {
    flow: [] as Readonly<PFNodeID[]>,
    idx: -1,
    branch: undefined as void | DeepReadonly<PFNodeBranch>,
  };
  for (const flow of Object.values(pflow.flow)) {
    if (
      !immutableFindPFNode(
        pflow.nodes,
        flow,
        ({ flow, idx, parent, branch }) => {
          if (flow[idx] === id) {
            if (parent_id) {
              if (parent_id === parent?.id || parent_id === id) {
                result = { flow, idx, branch };
                return false;
              }
            } else {
              result = { flow, idx, branch };
              return false;
            }
          }

          return true;
        }
      )
    ) {
      break;
    }
  }
  return result;
};

export const immutableFindPFNode = (
  nodes: DeepReadonly<Record<string, PFNode>>,
  flow: Readonly<PFNodeID[]>,
  fn: (arg: {
    flow: Readonly<PFNodeID[]>;
    idx: number;
    parent?: DeepReadonly<PFNode>;
    branch?: DeepReadonly<PFNodeBranch>;
    is_invalid: boolean;
  }) => boolean,
  visited = new Set<string>(),
  arg?: {
    parent?: DeepReadonly<PFNode>;
    branch?: DeepReadonly<PFNodeBranch>;
  }
) => {
  let idx = 0;
  for (const id of flow) {
    if (
      !fn({
        flow,
        idx,
        parent: arg?.parent,
        branch: arg?.branch,
        is_invalid: false,
      })
    ) {
      return false;
    }
    const node = nodes[id];
    if (!node) {
      fn({
        flow,
        idx,
        parent: arg?.parent,
        branch: arg?.branch,
        is_invalid: true,
      });
      idx++;
      continue;
    }
    if (visited.has(node.id)) {
      idx++;
      continue;
    } else {
      visited.add(node.id);
    }

    if (node && node.branches) {
      for (const branch of node.branches) {
        if (branch.flow.length > 0) {
          if (
            !immutableFindPFNode(nodes, branch.flow, fn, visited, {
              parent: node,
              branch,
            })
          ) {
            return false;
          }
        }
      }
    }
    idx++;
  }
  return true;
};

export const findPFNode = (
  nodes: Record<string, PFNode>,
  flow: PFNodeID[],
  fn: (arg: {
    flow: PFNodeID[];
    idx: number;
    parent?: PFNode;
    branch?: PFNodeBranch;
    is_invalid: boolean;
  }) => boolean,
  visited = new Set<string>(),
  arg?: {
    parent?: PFNode;
    branch?: PFNodeBranch;
  }
) => {
  let idx = 0;
  for (const id of flow) {
    if (
      !fn({
        flow,
        idx,
        parent: arg?.parent,
        branch: arg?.branch,
        is_invalid: false,
      })
    ) {
      return false;
    }
    const node = nodes[id];
    if (!node) {
      fn({
        flow,
        idx,
        parent: arg?.parent,
        branch: arg?.branch,
        is_invalid: true,
      });
      idx++;
      continue;
    }
    if (visited.has(node.id)) {
      idx++;
      continue;
    } else {
      visited.add(node.id);
    }

    if (node && node.branches) {
      for (const branch of node.branches) {
        if (branch.flow.length > 0) {
          if (
            !findPFNode(nodes, branch.flow, fn, visited, {
              parent: node,
              branch,
            })
          ) {
            return false;
          }
        }
      }
    }
    idx++;
  }
  return true;
};

export const findFlow = ({
  id,
  pflow: pf,
  from,
}: {
  id: string;
  pflow: PFlow;
  from?: string;
}) => {
  let result = {
    flow: null as null | PFNodeID[],
    idx: -1,
    branch: undefined as void | PFNodeBranch,
  };
  for (const flow of Object.values(pf.flow)) {
    if (
      !loopPFNode(pf.nodes, flow, ({ flow, idx, parent, branch }) => {
        if (flow[idx] === id) {
          if (from) {
            if (from === parent?.id || from === id) {
              result = { flow, idx, branch };
              return false;
            }
          } else {
            result = { flow, idx, branch };
            return false;
          }
        }

        return true;
      })
    ) {
      break;
    }
  }
  return result;
};

export const loopPFNode = (
  nodes: Record<string, PFNode>,
  flow: PFNodeID[],
  fn: (arg: {
    flow: PFNodeID[];
    idx: number;
    parent?: PFNode;
    branch?: PFNodeBranch;
    is_invalid: boolean;
  }) => boolean,
  visited = new Set<string>(),
  arg?: { parent: PFNode; branch?: PFNodeBranch }
) => {
  let idx = 0;
  for (const id of flow) {
    if (idx === 0 && arg?.parent?.id === flow[0]) {
      idx++;
      continue;
    }

    const continue_loop = fn({
      flow,
      idx,
      parent: arg?.parent,
      branch: arg?.branch,
      is_invalid: false,
    });
    if (!continue_loop) {
      return false;
    }

    const node = nodes[id];
    if (!node) {
      fn({
        flow,
        idx,
        parent: arg?.parent,
        branch: arg?.branch,
        is_invalid: true,
      });
      continue;
    }
    if (visited.has(node.id)) {
      continue;
    } else {
      visited.add(node.id);
    }

    if (node && node.branches) {
      for (const branch of node.branches) {
        if (branch.flow.length > 0) {
          if (
            !loopPFNode(nodes, branch.flow, fn, visited, {
              parent: node,
              branch,
            })
          ) {
            return false;
          }
        }
      }
    }
    idx++;
  }
  return true;
};
