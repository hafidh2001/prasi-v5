import { Edge, EdgeChange } from "@xyflow/react";
import { PFNodeDefinition, RPFlow } from "../runtime/types";
import { findPFNode, immutableFindPFNode } from "./find-node";
import { fg } from "./flow-global";
import { allNodeDefinitions } from "../runtime/nodes";
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
              for (const flow of Object.values(pflow.flow)) {
                findPFNode(
                  pflow.nodes,
                  flow,
                  ({ flow, idx, parent, is_invalid }) => {
                    if (is_invalid) {
                      for (const [k, v] of Object.entries(pflow.flow)) {
                        if (flow === v) {
                          delete pflow.flow[k];
                        }
                      }
                      return false;
                    }

                    if (flow.includes(edge.target)) {
                      if (
                        flow[idx - 1] === edge.source ||
                        parent?.id === edge.source
                      ) {
                        const from_node = pflow.nodes[edge.source];
                        const from_def = (allNodeDefinitions as any)[
                          from_node.type
                        ] as PFNodeDefinition<any>;

                        const to_node = pflow.nodes[edge.target];
                        const to_def = (allNodeDefinitions as any)[
                          to_node.type
                        ] as PFNodeDefinition<any>;

                        if (from_def.on_before_disconnect) {
                          from_def.on_before_disconnect({
                            from: from_node,
                            to: to_node,
                            flow,
                          });
                        }

                        if (to_def.on_before_disconnect) {
                          to_def.on_before_disconnect({
                            from: from_node,
                            to: to_node,
                            flow,
                          });
                        }

                        const res = flow.splice(idx, flow.length - idx);
                        if (res.length > 0) {
                          pflow.flow[res[0]] = res;
                        }
                        return false;
                      } else {
                        const idx = flow.indexOf(edge.target);
                        if (idx >= 0) {
                          const res = flow.splice(idx);
                          if (res.length > 1) {
                            pflow.flow[res[0]] = res;
                          }
                        }
                      }
                    }

                    return true;
                  }
                );
              }
            });
          }
        }
      }
    }
  }
};
