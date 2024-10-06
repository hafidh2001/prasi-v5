import { Edge, Node, OnSelectionChangeParams, ReactFlowInstance } from "@xyflow/react";
import { PFRunResult } from "../runtime/runner";
import { PFlow, PFNode, PFNodeBranch, RPFlow } from "../runtime/types";
import { PNode } from "logic/types";
import { PRASI_NODE_DEFS } from "../runtime/nodes";

export type PrasiFlowPropLocal = {
  selection: {
    nodes: Node[];
    edges: Edge[];
    loading: boolean;
    selectAll: () => void;
    changes?: OnSelectionChangeParams;
  };
};

const fg_default = {
  pflow: null as unknown as RPFlow,
  pointer_up_id: "",
  pointer_up_pos: { x: 0, y: 0 },
  pointer_to: null as null | { x: number; y: number },
  updateNoDebounce(
    action_name: string,
    fn: (arg: { pflow: PFlow; node: PNode }) => void,
    next?: (arg: { pflow?: RPFlow | null; node: PNode }) => void
  ) {},
  update(
    action_name: string,
    fn: (arg: { pflow: PFlow; node: PNode }) => void,
    next?: (arg: { pflow?: RPFlow | null }) => void
  ) {},
  update_timeout: null as any,
  main: null as null | {
    reactflow: null | ReactFlowInstance<Node, Edge>;
    render: () => void;
    action: {
      resetSelectedElements: () => void;
      addSelectedNodes: (arg: string[]) => void;
      addSelectedEdges: (arg: string[]) => void;
      focusNode: (id: string) => void;
    };
  },
  run: null as null | PFRunResult,
  node_running: [] as string[],
  resizing: new Set<string>(),
  prop: null as
    | null
    | (PrasiFlowPropLocal & {
        render: () => void;
      }),
  render() {},
  prasi: {
    item_id: "",
    skip_init_update: false,
    updated_outside: false,
    resetDefault: (relayout: boolean) => {},
  },
  refreshFlow(pflow: RPFlow | PFlow) {},
  pickNodeType: null as null | {
    x: number;
    y: number;
    from_id: string,
    pick: (type: keyof PRASI_NODE_DEFS) => void;
  },
};
const w = window as unknown as {
  prasi_flow_global: typeof fg_default;
};
if (!w.prasi_flow_global) {
  w.prasi_flow_global = fg_default;
}

export const fg = w.prasi_flow_global;
