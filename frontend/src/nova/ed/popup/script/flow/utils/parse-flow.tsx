import { Edge, Node, Position } from "@xyflow/react";
import { RPFlow } from "../runtime/types";
import { parseNodes } from "./parse-node";

export const parseFlow = (
  pf: RPFlow,
  current: { nodes: Node[]; edges: Edge[] }
) => {
  const parsed = {
    nodes: [] as any[],
    edges: [],
    unflowed_nodes: [] as any[],
    internal_unflowed: new Set(Object.keys(pf.nodes)),
  };

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
            rf_unflowed_nodes: parsed.internal_unflowed,
            x: 0,
            y: 0,
            next_flow: [],
          },
        });
      }
    }
  }

  if (parsed.internal_unflowed.size > 0) {
    parsed.internal_unflowed.forEach((id) => {
      const inode = pf.nodes[id];
      if (inode) {
        const node = {
          id: inode.id,
          type: "default",
          className: inode.type,
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          data: {
            type: inode.type,
            label: inode.type === "start" ? "Start" : inode.name,
          },
          position: inode.position || {
            x: 0,
            y: 0,
          },
        };
        parsed.unflowed_nodes.push(node);
      }
    });
  }

  return parsed;
};
