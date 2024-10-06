import { Edge, EdgeChange } from "@xyflow/react";
import { allNodeDefinitions } from "../runtime/nodes";
import { PFNodeDefinition, RPFlow } from "../runtime/types";
import { findFlow, findPFNode } from "./find-node";
import { fg } from "./flow-global";
import { current } from "immer";

export const pflowEdgeChanges = ({
  changes,
  pflow,
  edges,
  setEdges,
}: {
  changes: EdgeChange<Edge>[];
  pflow: RPFlow;
  edges: Edge[];
  setEdges: (e: Edge[]) => void;
}) => {
  if (pflow) {
    if (
      changes.length === 2 &&
      changes[0].type === "remove" &&
      changes[1].type === "remove"
    ) {
      const from = changes[0];
      const to = changes[1];

      const from_edge = edges.find((e) => from.id === e.id);
      const to_edge = edges.find((e) => to.id === e.id);

      if (from_edge && to_edge) {
        const from_node = pflow.nodes[from_edge.source];
        if (from_node.branches) {
        } else {
          setEdges([
            ...edges,
            {
              id: `${from_edge.source}-${to_edge.target}`,
              source: from_edge.source,
              target: to_edge.target,
              animated: true,
            },
          ]);
        }
      }
    } else if (changes.length === 1) {
      for (const c of changes) {
        if (c.type === "remove") {
          const edge = edges.find((e) => e.id === c.id);
          if (edge) {
            fg.update("Flow Remove Line", ({ pflow }) => {
              const found = findFlow({
                pflow,
                id: edge.target,
                from: edge.source,
              });
              if (found.flow) {
                const idx = found.idx;
                const flow = found.flow;
                const parent = found.parent;
                const res = flow.splice(idx, flow.length - idx);
                if (flow.length <= 1 && parent) {
                  parent.branches = parent?.branches?.filter(
                    (e) => e.flow !== flow
                  );
                }
                if (res.length > 0) pflow.flow[res[0]] = res;
              }
            });
          }
        }
      }
    }
  }
};
