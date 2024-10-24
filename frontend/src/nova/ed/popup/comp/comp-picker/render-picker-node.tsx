import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { RPNComponent } from "./rpn-component";
import { RPNFolder } from "./rpn-folder";

export type CompPickerNode = {
  type: "folder" | "comp";
  name: string;
  id: string;
  idx: string;
};
export const compRenderPickerNode = (
  node: NodeModel<CompPickerNode>,
  prm: RenderParams,
  checked: boolean,
  onCheck: (item_id: string) => void
) => {
  if (node.data?.type === "folder") return <RPNFolder node={node} prm={prm} />;
  if (node.data?.type === "comp")
    return (
      <RPNComponent node={node} prm={prm} checked={checked} onCheck={onCheck} />
    );
  return <></>;
};
