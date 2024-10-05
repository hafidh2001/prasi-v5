import {
  Background,
  ControlButton,
  Controls,
  Edge,
  getOutgoers,
  Node,
  Position,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStore,
  useStoreApi,
  Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { WandSparkles } from "lucide-react";
import { useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { PFlow, RPFlow } from "./runtime/types";
import { pflowConnectEnd } from "./utils/connect-end";
import { pflowEdgeChanges } from "./utils/edge-changes";
import { fg } from "./utils/flow-global";
import { getLayoutedElements } from "./utils/node-layout";
import { parseFlow } from "./utils/parse-flow";
import { removeNodes } from "./utils/remove-node";
import { RenderEdge } from "./utils/render-edge";
import { RenderNode } from "./utils/render-node";
import { restoreViewport } from "./utils/restore-viewport";
import { NodeTypePicker } from "./utils/type-picker";

export function PrasiFlowEditor({
  pflow,
  resetDefault,
  has_flow,
  bind,
}: {
  pflow: RPFlow;
  resetDefault: (relayout: boolean) => void;
  has_flow: boolean;
  bind: (arg: { relayout: () => void }) => void;
}) {
  const local = useLocal({
    reactflow: null as null | ReactFlowInstance<Node, Edge>,
    save_timeout: null as any,
    refresh: { executing: false, timeout: null as any },
    nodeTypes: {
      default: RenderNode,
    },
    viewport: undefined as undefined | Viewport,
    edgeTypes: {
      default: RenderEdge,
    },
    action: {
      resetSelectedElements: () => {},
      addSelectedNodes: () => {},
      addSelectedEdges: () => {},
      focusNode: () => {},
    },
  });
  fg.main = local;

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  fg.refreshFlow = (pflow: RPFlow | PFlow) => {
    fg.pflow = pflow;
    const parsed = parseFlow(pflow, { nodes, edges });
    setNodes(parsed.nodes);
    setEdges(parsed.edges);
  };

  useEffect(() => {
    fg.pflow = pflow;
    const parsed = parseFlow(pflow, { nodes: [], edges: [] });

    const unflowed: Node[] = [];
    if (parsed.unflowed_nodes.size > 0) {
      parsed.unflowed_nodes.forEach((id) => {
        const inode = pflow.nodes[id];
        if (inode) {
          unflowed.push({
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
          });
        }
      });
    }

    setNodes([...parsed.nodes, ...unflowed]);
    setEdges(parsed.edges);
    restoreViewport({ pflow, local });

    const sel = fg.prop?.selection;
    if (sel) {
      fg.main?.action.addSelectedEdges(sel.edges?.map((e) => e.id) || []);
      fg.main?.action.addSelectedNodes(sel.nodes?.map((e) => e.id) || []);
    }
  }, [pflow]);

  const relayoutNodes = (arg?: { nodes: Node[]; edges: Edge[] }) => {
    try {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(arg?.nodes || nodes, arg?.edges || edges, "TB");

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      if (has_flow) {
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
      }

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
  bind({ relayout: relayoutNodes });

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
                stroke: blue !important;
              }
              .react-flow__edge-text {
                fill: blue !important;
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
      onPointerUp={(e) => {
        fg.pointer_up_pos = { x: e.clientX, y: e.clientY };
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
            const sel = fg.prop.selection;
            if (sel.edges.length === 1 && sel.nodes.length === 0) {
              if (changes.nodes.length === 0) {
                fg.prop.selection.changes = changes;
                setTimeout(local.render);
                return;
              }
            }

            fg.prop.selection = {
              ...changes,
              changes,
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
          if (pf) {
            const del_changes = [];
            for (const c of changes) {
              if (c.type === "position") {
                fg.update("Flow Move Node", ({ pflow }) => {
                  const node = pflow.nodes[c.id];
                  if (node) {
                    node.position = c.position;
                  }
                });
              } else if (c.type === "remove") {
                del_changes.push(c);
              }
            }
            if (del_changes.length > 0) {
              removeNodes({ changes: del_changes, edges, resetDefault });
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
          pflowEdgeChanges({ changes, pflow, edges, setEdges });
          return onEdgesChange(changes);
        }}
        nodes={nodes}
        edges={edges}
        onConnectEnd={(_, state) => {
          pflowConnectEnd({ state, pflow, edges });
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
        onPointerUp={() => {
          setTimeout(() => {
            const sel = fg.prop?.selection;
            if (
              sel &&
              sel.edges.length === 1 &&
              sel.changes?.edges.length === 0
            ) {
              sel.edges = [];
              fg.prop?.render();
            }
          }, 100);
        }}
      >
        <Selection />
        <Background />
        <Controls position="top-left" showInteractive={false}>
          <ControlButton onClick={() => relayoutNodes()} title="auto layout">
            <WandSparkles strokeWidth={1.8} />
          </ControlButton>
        </Controls>
      </ReactFlow>
      {fg.pickNodeType && (
        <>
          <NodeTypePicker
            from_id={fg.pickNodeType.from_id}
            pflow={pflow}
            name={"pick-node"}
            value={""}
            onChange={(value) => {
              fg.pickNodeType?.pick(value);
              fg.pickNodeType = null;
              fg.main?.render();
            }}
            defaultOpen={true}
          >
            <div
              className={cx(
                "absolute rounded-xs",
                css`
                  left: ${fg.pickNodeType.x}px;
                  top: ${fg.pickNodeType.y}px;
                  width: 10px;
                  height: 10px;
                  @keyframes dash {
                    to {
                      background-position:
                        100% 0,
                        100% 100%,
                        0 100%,
                        0 0;
                    }
                  }

                  &::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-image:
                      linear-gradient(90deg, black 50%, transparent 50%),
                      /* Top */
                        linear-gradient(0deg, black 50%, transparent 50%),
                      /* Right */
                        linear-gradient(90deg, black 50%, transparent 50%),
                      /* Bottom */
                        linear-gradient(0deg, black 50%, transparent 50%); /* Left */

                    background-size:
                      4px 1px,
                      /* Top */ 1px 4px,
                      /* Right */ 4px 1px,
                      /* Bottom */ 1px 4px; /* Left */

                    background-position:
                      0 0,
                      /* Top */ 100% 0,
                      /* Right */ 0 100%,
                      /* Bottom */ 0 0; /* Left */

                    background-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
                    animation: dash 4s linear infinite; /* Longer duration */
                  }
                `
              )}
            ></div>
          </NodeTypePicker>
        </>
      )}
    </div>
  );
}

const Selection = () => {
  const { zoomIn, zoomOut, setCenter } = useReactFlow();
  const store = useStoreApi();
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
      focusNode: (id) => {
        const { nodeLookup } = store.getState();
        const nodes = Array.from(nodeLookup).map(([, node]) => node);

        if (nodes.length > 0) {
          const node = nodes.find((node) => node.id === id);

          if (node && node.measured.width && node.measured.height) {
            const x = node.position.x + node.measured.width / 2;
            const y = node.position.y + node.measured.height / 2;

            setCenter(x, y, { duration: 1000 });
          }
        }
      },
    };
  return <></>;
};
