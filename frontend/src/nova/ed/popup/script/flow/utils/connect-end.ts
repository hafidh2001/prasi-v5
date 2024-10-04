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

  const on_before_connect = (
    pflow: PFlow,
    arg: { node: PFNode; is_new: boolean }
  ) => {
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

        if (fg.pointer_up_pos) {

          fg.pickNodeType = {
            x: fg.pointer_up_pos.x,
            y: fg.pointer_up_pos.y,
            from_id: from_id,
            pick(type) {
              if (!type) return;
              fg.update(
                "Flow Create Node",
                ({ pflow }) => {
                  const from = pflow.nodes[from_id];

                  on_before_connect(pflow, { node: from, is_new: true });

                  const to_node = {
                    type: type,
                    id: createId(),
                    position,
                  };
                  to_id = to_node.id;
                  pflow.nodes[to_node.id] = to_node;

                  if (from.branches) {
                    const empty_branch = from.branches.find(
                      (e) => e.flow.length <= 1
                    );
                    const f = findFlow({ id: from_id, pflow: pflow });

                    if (empty_branch) {
                      if (!f.flow) {
                        pflow.flow[from_id] = [from.id];
                      }

                      if (to_node) {
                        if (!empty_branch.flow.includes(from.id))
                          empty_branch.flow.push(from.id);
                        empty_branch.flow.push(to_node.id);
                      }
                    } else {
                      if (f) {
                        f.flow?.push(to_node.id);
                      }
                    }
                  } else {
                    const f = findFlow({ id: from_id, pflow: pflow });
                    if (f) {
                      if (!f.flow) {
                        pflow.flow[from_id] = [from.id];
                      } else {
                        const res = f.flow?.splice(
                          f.idx + 1,
                          f.flow.length - f.idx,
                          to_node.id
                        );
                        if (res && res.length > 0) {
                          pflow.flow[res[0]] = res;
                        }
                      }
                    }
                  }
                },
                ({ pflow }) => {
                  fg.refreshFlow(pflow as PFlow);
                  setTimeout(() => {
                    fg.main?.action.resetSelectedElements();
                    fg.main?.action.addSelectedNodes([to_id]);
                  });
                }
              );
            },
          };
          fg.main?.render();
        }

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
      const form_dev = (allNodeDefinitions as any)[
        from_node.type
      ] as PFNodeDefinition<any>;

      if (from_node) {
        if (from_node.branches || !!form_dev.has_branches) {
          fg.update("Flow Connect Node", ({ pflow }) => {
            const from_node = pflow.nodes[from_id];
            on_before_connect(pflow, { node: from_node, is_new: true });

            let picked_branches = from_node.branches?.find(
              (e) => e.flow.length <= 1
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
            } else {
              if (!form_dev.has_branches) {
                delete from_node.branches;
                const found = findFlow({ id: from_node.id, pflow });
                if (found && found.flow) {
                  connectNode(pflow, found.flow, from_node.id, to_id);
                }
              } else {
              }
            }
          });
        } else {
          const found = immutableFindFlow({ id: from_node.id, pflow });

          if (found && found.flow[found.idx + 1] !== to_id) {
            fg.update("Flow Connect Node", ({ pflow }) => {
              const from_node = pflow.nodes[from_id];
              on_before_connect(pflow, { node: from_node, is_new: false });

              const found = findFlow({ id: from_node.id, pflow });
              if (found) {
                if (found.flow) {
                  connectNode(pflow, found.flow, from_node.id, to_id);
                } else {
                  pflow.flow[from_id] = [from_id, to_id];
                }
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
