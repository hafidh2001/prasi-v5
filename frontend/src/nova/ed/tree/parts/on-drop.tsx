import { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { PNode } from "crdt/node/flatten";

export const treeOnDrop: (
  tree: NodeModel<PNode>[],
  options: DropOptions<PNode>
) => void = () => {};
