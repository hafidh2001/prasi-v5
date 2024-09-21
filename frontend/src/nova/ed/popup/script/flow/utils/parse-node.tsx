import { Edge, Node, Position } from "@xyflow/react";
import { DeepReadonly, PFNode, PFNodeID } from "../runtime/types";
import { allNodeDefinitions } from "../runtime/nodes";

export const EdgeType = "default";

export const parseNodes = (
  nodes: DeepReadonly<Record<PFNodeID, PFNode>>,
  flow: DeepReadonly<PFNodeID[]>,
  opt?: {
    current?: {
      nodes: Node[];
      edges: Edge[];
    };
    existing?: {
      rf_nodes: Node[];
      rf_edges: Edge[];
      x: number;
      y: number;
      next_flow: DeepReadonly<PFNode>[];
    };
  }
) => {
  const existing = opt?.existing || undefined;
  const rf_nodes: Node[] = existing ? existing.rf_nodes : [];
  const rf_edges: Edge[] = existing ? existing.rf_edges : [];

  let flow_mapped: DeepReadonly<PFNode>[] = [];
  for (let i = 0; i < flow.length; i++) {
    const id = flow[i];

    if (!nodes[id]) {
      break;
    } else {
      flow_mapped.push(nodes[id]);
    }
  }

  let flow_nodes = [...flow_mapped, ...(existing?.next_flow || [])];
  let prev = null as null | Node;
  let y = 0;

  for (const inode of flow_nodes) {
    const new_node: Node = {
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
        x: (existing?.x || 0) * 200,
        y: ((existing?.y || 0) + y) * 100,
      },
    };

    const node = opt?.current?.nodes.find((e) => inode.id === e.id) || new_node;
    if (new_node !== node) {
      for (const [k, v] of Object.entries(new_node)) {
        (node as any)[k] = v;
      }
    } else {
    }

    y++;

    const on_init = (allNodeDefinitions as any)[inode.type]?.on_init;

    if (on_init) {
      on_init({ node: inode, flow, nodes });
    }

    if (inode.branches) {
      let i = 0;
      let by = y;
      for (const branch of inode.branches) {
        if (branch.flow.length > 0) {
          if (node.id === branch.flow[0]) {
            const flow = branch.flow.slice(1);
            const edge_id = `${node.id}-${flow[0]}`;

            if (rf_edges.find((e) => e.id === edge_id)) {
              break;
            }
            rf_edges.push({
              id: edge_id,
              source: node.id,
              target: flow[0],
              type: EdgeType,
              data: { branch },
              animated: true,
            });

            parseNodes(nodes, flow, {
              current: opt?.current,
              existing: {
                rf_nodes,
                rf_edges,
                x: i++ - 0.5,
                y: by,
                next_flow: flow_nodes.slice(y),
              },
            });
          } else {
            const edge_id = `${node.id}-${branch.flow[0]}`;
            if (rf_edges.find((e) => e.id === edge_id)) {
              break;
            }
            rf_edges.push({
              id: edge_id,
              source: node.id,
              target: branch.flow[0],
              type: EdgeType,
              data: { branch },
              animated: true,
            });

            parseNodes(nodes, branch.flow, {
              current: opt?.current,
              existing: {
                rf_nodes,
                rf_edges,
                x: i++ - 0.5,
                y: by,
                next_flow: flow_nodes.slice(y),
              },
            });
          }
        }
      }
    }

    if (prev) {
      const edge_id = `${prev.id}-${node.id}`;
      if (rf_edges.find((e) => e.id === edge_id)) {
      } else {
        rf_edges.push({
          id: edge_id,
          source: prev.id,
          type: EdgeType,
          target: node.id,
          animated: true,
        });
      }
    }

    prev = node;
    rf_nodes.push(node);
    if (inode.branches) {
      break;
    }
  }

  return { nodes: rf_nodes, edges: rf_edges };
};

export const pfnodeToRFNode = (pfnode: PFNode) => {
  const node: Node = {
    id: pfnode.id,
    type: "default",
    className: pfnode.type,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    data: {
      type: pfnode.type,
      label: pfnode.type === "start" ? "Start" : pfnode.name,
    },
    position: pfnode.position || { x: 0, y: 0 },
  };
  return node;
};
