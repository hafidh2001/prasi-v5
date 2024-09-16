import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { PFRunResult } from "../runtime/runner";
import { PFlow, PFNode } from "../runtime/types";

export type PrasiFlowPropLocal = {
  selection: {
    nodes: Node[];
    edges: Edge[];
    loading: boolean;
  };
};

const fg_default = {
  pointer_up_id: "",
  pointer_to: null as null | { x: number; y: number },
  // @ts-ignore
  reload: (relayout?: boolean) => {},
  main: null as null | {
    pflow: null | PFlow;
    reactflow: null | ReactFlowInstance<Node, Edge>;
    render: () => void;
    action: {
      resetSelectedElements: () => void;
      addSelectedNodes: (arg: string[]) => void;
      addSelectedEdges: (arg: string[]) => void;
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
};
const w = window as unknown as {
  prasi_flow_global: typeof fg_default;
};
if (!w.prasi_flow_global) {
  w.prasi_flow_global = fg_default;
}

export const fg = w.prasi_flow_global;
