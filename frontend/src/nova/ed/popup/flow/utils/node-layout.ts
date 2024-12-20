import { Edge, Node } from "@xyflow/react";
import dagre from "dagre";

export const nodeWidth = 250;
const nodeHeight = 64;

export const getSize = (node: Node) => {
  if (node.measured) {
    return { w: node.measured.width || 0, h: node.measured.height || 0 };
  }
  return { w: nodeWidth, h: nodeHeight };
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  for (const node of nodes) {
    const size = getSize(node);
    if (!size.w && !size.h) {
      throw new Error("no size");
    }
    dagreGraph.setNode(node.id, {
      width: size.w,
      height: size.h,
    });
  }

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const size = getSize(node);
    if (!size.w && !size.h) {
      throw new Error("no size");
    }
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - size.w / 2,
        y: nodeWithPosition.y - size.h / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes as Node[], edges: edges as Edge[] };
};
