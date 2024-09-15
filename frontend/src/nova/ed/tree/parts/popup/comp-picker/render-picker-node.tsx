import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { RPNFolder } from "./rpn-folder";
import { RPNComponent } from "./rpn-component";

export type CompPickerNode = {
  type: "folder" | "comp";
  name: string;
  id: string;
};
export const compRenderPickerNode = (
  node: NodeModel<CompPickerNode>,
  prm: RenderParams
) => {
  if (node.data?.type === "folder") return <RPNFolder node={node} prm={prm} />;
  if (node.data?.type === "comp") return <RPNComponent node={node} prm={prm} />;
  return <></>;
};
