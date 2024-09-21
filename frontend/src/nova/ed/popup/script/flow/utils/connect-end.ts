import { createId } from "@paralleldrive/cuid2";
import { Edge, FinalConnectionState } from "@xyflow/react";
import { InternalNodeBase } from "@xyflow/system";
import { allNodeDefinitions } from "../runtime/nodes";
import {
  PFlow,
  PFNode,
  PFNodeDefinition,
  PFNodeID,
  RPFlow,
} from "../runtime/types";
import { findFlow, immutableFindFlow } from "./find-node";
import { fg } from "./flow-global";
import { current } from "immer";

export const pflowConnectEnd = ({
  state,
  pflow,
  edges,
}: {
  state: FinalConnectionState<InternalNodeBase>;
  pflow: RPFlow;
  edges: Edge[];
}) => {
  const pf = pflow;
  if (!pf) return;

  let from_id = "";
  let to_id = "";
  const from_rf = state.fromNode;
  if (from_rf) from_id = from_rf.id;

  const on_before_connect = (arg: { node: PFNode; is_new: boolean }) => {
    const def = (allNodeDefinitions as any)[
      arg.node.type
    ] as PFNodeDefinition<any>;
    if (def && def.on_before_connect) {
      def.on_before_connect({ ...arg, pflow });
    }
  };

  if (state.isValid) {
    const to = state.toNode;
    if (to) to_id = to.id;
  } else {
    if (fg.pointer_up_id) {
      to_id = fg.pointer_up_id;
      fg.pointer_up_id = "";
    } else {
      if (from_rf) {
        const position = fg.pointer_to || {
          x: from_rf.position.x,
          y: from_rf.position.y + 100,
        };
        position.x -= 70;
        fg.pointer_to = null;

        fg.update(
          "Flow Create Node",
          ({ pflow }) => {
            const from = pflow.nodes[from_id];
            on_before_connect({ node: from, is_new: true });

            const to_node = {
              type: "code",
              id: createId(),
              position,
            };
            to_id = to_node.id;
            pflow.nodes[to_node.id] = to_node;

            if (from.branches) {
              const empty_branch = from.branches.find(
                (e) => e.flow.length === 0
              );
              console.log(empty_branch, to_node);

              if (empty_branch) {
                if (to_node) {
                  empty_branch.flow.push(from.id);
                  empty_branch.flow.push(to_node.id);
                }
              }
            } else {
              const f = findFlow({ id: from_id, pflow: pflow });
              if (f) {
                f.flow?.push(to_node.id);
              }
            }
          },
          ({ pflow }) => {
            fg.refreshFlow(pflow);
            setTimeout(() => {
              fg.main?.action.resetSelectedElements();
              fg.main?.action.addSelectedNodes([to_id]);
            });
          }
        );

        return;
      }
    }
  }

  if (from_id && to_id) {
    if (from_id === to_id) return;

    const edgeFound = edges.find((e) => {
      return e.source === from_id && e.target === to_id;
    });

    if (!edgeFound && pf) {
      const from_node = pf.nodes[from_id];

      if (from_node) {
        if (from_node.branches) {
          fg.update("Flow Connect Node", ({ pflow }) => {
            const from_node = pflow.nodes[from_id];
            on_before_connect({ node: from_node, is_new: false });

            let picked_branches = from_node.branches?.find(
              (e) => e.flow.length === 0
            );

            if (!picked_branches && from_node?.branches?.[0]) {
              const spare = from_node.branches?.[0]?.flow;
              if (spare) {
                from_node.branches[0].flow = [];
                pflow.flow[spare[0]] = spare;
                picked_branches = from_node.branches[0];
              }
            }

            if (picked_branches) {
              connectNode(pflow, picked_branches.flow, from_node.id, to_id);
            }
          });
        } else {
          const found = immutableFindFlow({ id: from_node.id, pflow });

          if (found && found.flow[found.idx + 1] !== to_id) {
            fg.update("Flow Connect Node", ({ pflow }) => {
              const from_node = pflow.nodes[from_id];
              on_before_connect({ node: from_node, is_new: false });

              const found = findFlow({ id: from_node.id, pflow });
              if (found && found.flow) {
                connectNode(pflow, found.flow, from_node.id, to_id);
              }
            });
          }
        }
      }
    }
  }
};

const connectNode = (
  pflow: PFlow,
  flow: PFNodeID[],
  from_id: string,
  to_id: string
) => {
  const idx = flow.findIndex((id) => id === from_id);
  const found = idx >= 0;

  if (found) {
    const last_flow = flow.slice(idx + 1);
    flow.splice(idx + 1, flow.length - idx - 1);

    if (last_flow[0] && !pflow.flow[last_flow[0]]) {
      pflow.flow[last_flow[0]] = last_flow;
    }
  }
  const spare = pflow.flow[to_id];
  if (spare) {
    delete pflow.flow[to_id];
    for (const id of spare) {
      flow.push(id);
    }
  } else {
    flow.push(to_id);
  }
};
