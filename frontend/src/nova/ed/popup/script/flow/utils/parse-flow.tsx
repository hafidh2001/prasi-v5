import { Edge, Node } from "@xyflow/react";
import { RPFlow } from "../runtime/types";
import { parseNodes } from "./parse-node";

export const parseFlow = (
  pf: RPFlow,
  current: { nodes: Node[]; edges: Edge[] }
) => {
  const parsed = { nodes: [], edges: [], unflowed_nodes: new Set(Object.keys(pf.nodes)) };

  const existing = new Set<string>();

  if (pf.flow) {
    for (const id of Object.keys(pf.flow)) {
      existing.add(id);
    }

    const flows = Object.values(pf.flow);
    if (flows.length > 0) {
      for (const flow of flows) {
        parseNodes(pf.nodes, flow, {
          current,
          existing: {
            rf_edges: parsed.edges,
            rf_nodes: parsed.nodes,
            rf_unflowed_nodes: parsed.unflowed_nodes,
            x: 0,
            y: 0,
            next_flow: [],
          },
        });
      }
    }
  }

  return parsed;
};
