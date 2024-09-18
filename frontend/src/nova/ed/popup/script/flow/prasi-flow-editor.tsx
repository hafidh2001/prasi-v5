import { createId } from "@paralleldrive/cuid2";
import {
  Background,
  ControlButton,
  Controls,
  Edge,
  getOutgoers,
  Node,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
  useStore,
  Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { LayoutDashboard } from "lucide-react";
import { useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { allNodeDefinitions } from "./runtime/nodes";
import { PFNode, PFNodeDefinition, PFNodeID, RPFlow } from "./runtime/types";
import { findFlow, loopPFNode } from "./utils/find-node";
import { fg } from "./utils/flow-global";
import { getLayoutedElements } from "./utils/node-layout";
import { parseFlow } from "./utils/parse-flow";
import { RenderEdge } from "./utils/render-edge";
import { RenderNode } from "./utils/render-node";
import { savePF } from "./utils/save-pf";

export function PrasiFlowEditor({
  pflow,
  should_relayout,
}: {
  pflow: RPFlow;
  should_relayout: boolean;
  resetDefault: (relayout: boolean) => void;
}) {
  const local = useLocal({
    reactflow: null as null | ReactFlowInstance<Node, Edge>,
    save_timeout: null as any,
    refresh: { executing: false, timeout: null as any },
    nodeTypes: {
      default: RenderNode.bind({
        pflow,
      }),
    },
    viewport: undefined as undefined | Viewport,
    edgeTypes: {
      default: RenderEdge.bind({
        pflow,
      }),
    },
    action: {
      resetSelectedElements: () => {},
      addSelectedNodes: () => {},
      addSelectedEdges: () => {},
    },
  });
  fg.main = local;

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  useEffect(() => {
    local.nodeTypes.default = RenderNode.bind({ pflow });
    local.edgeTypes.default = RenderEdge.bind({ pflow });
    const parsed = parseFlow(pflow, { nodes: [], edges: [] });
    setNodes(parsed.nodes);
    setEdges(parsed.edges);

    let viewport = undefined as undefined | Viewport;

    try {
      viewport = JSON.parse(
        localStorage.getItem(`prasi-flow-vp-${pflow.name}`) || "undefined"
      );
    } catch (e) {}
    local.viewport = viewport;

    if (!local.viewport) {
      const ival = setInterval(() => {
        const ref = local.reactflow;
        if (ref) {
          ref.fitView();
          clearInterval(ival);
        }
      }, 10);
    }
  }, [pflow, should_relayout]);

  const relayoutNodes = (arg?: { nodes: Node[]; edges: Edge[] }) => {
    try {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(arg?.nodes || nodes, arg?.edges || edges, "TB");

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      fg.update("Flow Relayout", ({ pflow }) => {
        for (const n of layoutedNodes) {
          const node = pflow.nodes[n.id];
          if (node) {
            if (
              node.position?.x !== n.position.x ||
              node.position.y !== n.position.y
            ) {
              node.position = n.position;
            }
          }
        }
      });

      const ref = local.reactflow;
      if (ref) {
        setTimeout(() => {
          ref.fitView();
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const connectTo = (from: string, to: string, flow: PFNodeID[]) => {
    const idx = flow.findIndex((id) => id === from);
    const found = idx >= 0;

    const pf = fg.update("Flow Connect", ({ pflow }) => {
      if (found) {
        const last_flow = flow.slice(idx + 1);
        flow.splice(idx + 1, flow.length - idx - 1);

        if (last_flow[0] && !pflow.flow[last_flow[0]]) {
          pflow.flow[last_flow[0]] = last_flow;
        }
      }
      const spare = pflow.flow[to];
      if (spare) {
        delete pflow.flow[to];
        for (const id of spare) {
          flow.push(id);
        }
      } else {
        flow.push(to);
      }
    });

    const parsed = parseFlow(pf, { edges, nodes });
    setNodes(parsed.nodes);
    setEdges(parsed.edges);

    if (to) {
      setTimeout(() => {
        fg.main?.action.resetSelectedElements();
        fg.main?.action.addSelectedNodes([to]);
      }, 200);
    }
  };

  if (local.refresh.executing) {
    local.refresh.executing = false;
    setTimeout(local.render);
    return null;
  }

  return (
    <div
      className={cx(
        "w-full h-full",
        css`
          .react-flow__attribution {
            display: none;
          }

          .react-flow__node {
            cursor: pointer;
            border: 0px !important;
            box-shadow: none !important;
            width: auto;

            &.selected > .pf-node {
              outline: 1px solid blue;
              border: 1px solid blue;
            }
          }
          .react-flow__node-default {
            padding: 0;
          }

          .react-flow__edge {
            &.selected {
              .react-flow__edge-path {
                stroke-width: 2px;
                stroke: blue;
              }
              .react-flow__edge-text {
                fill: blue;
              }
            }
          }
          .react-flow__controls-button .lucide {
            fill: transparent;
            max-width: 15px;
            max-height: 15px;
          }
        `
      )}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
          e.stopPropagation();
          e.preventDefault();
          fg.prop?.selection.selectAll();
        }
      }}
    >
      <ReactFlow
        maxZoom={1.1}
        onInit={(ref) => {
          local.reactflow = ref;
        }}
        nodeTypes={local.nodeTypes}
        edgeTypes={local.edgeTypes}
        onSelectionChange={(changes) => {
          if (fg.prop) {
            fg.prop.selection = {
              ...changes,
              loading: fg.prop.selection.loading,
              selectAll() {
                fg.main?.action.resetSelectedElements();
                fg.main?.action.addSelectedEdges(edges?.map((e) => e.id) || []);
                fg.main?.action.addSelectedNodes(nodes?.map((e) => e.id) || []);
              },
            };
            fg.prop.render();
          }
        }}
        onNodesChange={(changes) => {
          const pf = pflow;
          let should_save = false;
          let action_name = "";
          if (pf) {
            let select_id = "";
            for (const c of changes) {
              if (c.type === "position") {
                fg.update("Flow Move Node", ({ pflow }) => {
                  const node = pflow.nodes[c.id];
                  if (node) {
                    node.position = c.position;
                  }
                });
              } else if (c.type === "remove") {
                should_save = true;
                action_name = "Delete Node";

                const node = pf.nodes[c.id];
                const node_branch = node?.branches
                  ? node.branches.find((e) => e.flow.length > 0)?.flow
                  : undefined;

                const target_id = edges
                  .filter((e) => e.source === c.id)
                  .map((e) => e.target)[0];

                delete pf.nodes[c.id];
                delete pf.flow[c.id];
                for (const node of Object.values(pf.nodes)) {
                  if (node.branches) {
                    for (const branch of node.branches) {
                      const idx = branch.flow.findIndex((e) => e === c.id);
                      if (idx >= 0) {
                        const spare_flow = branch.flow.splice(
                          idx,
                          branch.flow.length - idx
                        );

                        if (spare_flow.length > 1) {
                          pf.flow[spare_flow[0]] = spare_flow;
                        }
                      }
                    }
                  }
                }

                const source_ids = edges
                  .filter((e) => e.target === c.id)
                  .map((e) => e.source);

                for (const source of source_ids) {
                  if (!select_id) select_id = source;
                  const from = pf.nodes[source];
                  if (from) {
                    if (from.branches) {
                      const empty_branch = from.branches.find(
                        (e) => e.flow.length === 0
                      );
                      if (empty_branch) {
                        if (target_id) {
                          empty_branch.flow.push(from.id);
                          empty_branch.flow.push(target_id);
                        }
                      }
                    } else {
                      const source_flow = findFlow({ id: from.id, pf });
                      if (source_flow) {
                        if (node_branch) {
                          for (const id of node_branch) {
                            if (!source_flow.flow.includes(id))
                              source_flow.flow.push(id);
                          }
                        } else if (target_id) {
                          if (!source_flow.flow.includes(target_id))
                            source_flow.flow.push(target_id);
                        }
                        for (let i = 0; i < source_flow.flow.length; i++) {
                          const id = source_flow.flow[i];
                          if (id === c.id) {
                            source_flow.flow.splice(i, 1);
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          return onNodesChange(changes);
        }}
        isValidConnection={(connection) => {
          const target = nodes.find((node) => node.id === connection.target);
          const hasCycle = (node: Node, visited = new Set()) => {
            if (visited.has(node.id)) return false;

            visited.add(node.id);

            for (const outgoer of getOutgoers(node, nodes, edges)) {
              if (outgoer.id === connection.source) return true;
              if (hasCycle(outgoer, visited)) return true;
            }
          };

          if (target) {
            if (target.id === connection.source) return false;
            return !hasCycle(target);
          }
          return true;
        }}
        onEdgesChange={(changes) => {
          const pf = local.pflow;
          if (pf) {
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
                const from_node = pf.nodes[from_edge.source];
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
                    for (const flow of Object.values(pf.flow)) {
                      let should_break = false;
                      loopPFNode(
                        pf.nodes,
                        flow,
                        ({ flow, idx, parent, is_invalid }) => {
                          if (is_invalid) {
                            for (const [k, v] of Object.entries(pf.flow)) {
                              if (flow === v) {
                                delete pf.flow[k];
                              }
                            }
                            should_break = true;
                            return false;
                          }

                          if (flow.includes(edge.target)) {
                            if (
                              flow[idx - 1] === edge.source ||
                              parent?.id === edge.source
                            ) {
                              const res = flow.splice(idx, flow.length - idx);
                              if (res.length > 0) {
                                pf.flow[res[0]] = res;
                              }
                              should_break = true;
                              return false;
                            }
                          }

                          return true;
                        }
                      );
                      if (should_break) {
                        savePF("Connect Node", local.pflow);
                        setTimeout(() => {
                          fg.reload();
                        }, 100);
                        break;
                      }
                    }
                  }
                }
              }
            }
          }

          return onEdgesChange(changes);
        }}
        nodes={nodes}
        edges={edges}
        onConnectEnd={(_, state) => {
          const pf = local.pflow;
          if (!pf) return;

          let from_id = "";
          let to_id = "";
          const from_rf = state.fromNode;
          if (from_rf) from_id = from_rf.id;

          const on_before_connect = (arg: {
            node: PFNode;
            is_new: boolean;
          }) => {
            const def = (allNodeDefinitions as any)[
              arg.node.type
            ] as PFNodeDefinition<any>;
            if (def && def.on_before_connect) {
              def.on_before_connect({ ...arg, pflow });
            }
          };
          const on_after_connect = (arg: { from: PFNode; to: PFNode }) => {};

          if (state.isValid) {
            const to = state.toNode;
            if (to) to_id = to.id;
          } else {
            if (fg.pointer_up_id) {
              to_id = fg.pointer_up_id;
              fg.pointer_up_id = "";
            } else {
              const from = pf.nodes[from_id];
              on_before_connect({ node: from, is_new: true });

              if (from_rf) {
                const position = fg.pointer_to || {
                  x: from_rf.position.x,
                  y: from_rf.position.y + 100,
                };
                position.x -= 70;
                fg.pointer_to = null;

                const to_node = {
                  type: "code",
                  id: createId(),
                  position,
                };
                pf.nodes[to_node.id] = to_node;

                if (from.branches) {
                  const empty_branch = from.branches.find(
                    (e) => e.flow.length === 0
                  );
                  if (empty_branch) {
                    if (to_node) {
                      empty_branch.flow.push(from.id);
                      empty_branch.flow.push(to_node.id);
                      fg.reload();
                    }
                  }
                  savePF("Create Node", pf);
                } else {
                  const f = findFlow({ id: from_id, pf: pf });
                  if (f) {
                    f.flow.push(to_node.id);
                    fg.reload();

                    savePF("Create Node", pf);
                  }
                }

                setTimeout(() => {
                  fg.main?.action.resetSelectedElements();
                  fg.main?.action.addSelectedNodes([to_node.id]);
                }, 200);

                return;
              }
            }
          }

          if (from_id && to_id) {
            if (from_id === to_id) return;

            const found = edges.find((e) => {
              return e.source === from_id && e.target === to_id;
            });

            if (!found && pf) {
              // setEdges([
              //   ...edges,
              //   {
              //     id: `${from_id}-${to_id}`,
              //     source: from_id,
              //     target: to_id,
              //     type: EdgeType,
              //     animated: true,
              //   },
              // ]);

              const from_node = pf.nodes[from_id];

              if (from_node) {
                on_before_connect({ node: from_node, is_new: false });

                if (from_node.branches) {
                  let picked_branches = from_node.branches?.find(
                    (e) => e.flow.length === 0
                  );

                  if (!picked_branches) {
                    const spare = from_node?.branches?.[0]?.flow;
                    if (spare) {
                      from_node.branches[0].flow = [];
                      pf.flow[spare[0]] = spare;
                      picked_branches = from_node.branches[0];
                    }
                  }

                  if (picked_branches) {
                    connectTo(pf, from_id, to_id, picked_branches.flow);
                    const to_node = pf.nodes[to_id];
                    on_after_connect({ from: from_node, to: to_node });
                  }
                } else {
                  const found = findFlow({ id: from_node.id, pf });

                  if (found && found.flow[found.idx + 1] !== to_id) {
                    connectTo(pf, from_id, to_id, found.flow);

                    const to_node = pf.nodes[to_id];
                    on_after_connect({ from: from_node, to: to_node });
                  }
                }
                fg.reload();
              }
            }
          }
        }}
        viewport={local.viewport}
        onViewportChange={(e) => {
          localStorage.setItem(
            `prasi-flow-vp-${pflow.name}`,
            JSON.stringify(e)
          );
          local.viewport = e;
          local.render();
        }}
      >
        <Selection />
        <Background />
        <Controls position="top-left" showInteractive={false}>
          <ControlButton onClick={() => relayoutNodes()} title="auto layout">
            <LayoutDashboard strokeWidth={1.8} />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}

const Selection = () => {
  const { resetSelectedElements, addSelectedNodes, addSelectedEdges } =
    useStore((store) => ({
      resetSelectedElements: store.resetSelectedElements,
      addSelectedNodes: store.addSelectedNodes,
      addSelectedEdges: store.addSelectedEdges,
    }));

  if (fg.main)
    fg.main.action = {
      resetSelectedElements,
      addSelectedNodes,
      addSelectedEdges,
    };
  return <></>;
};
