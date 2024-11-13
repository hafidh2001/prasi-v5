import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { RPNComponent } from "./rpn-component";
import { RPNFolder } from "./rpn-folder";
import { Popover } from "utils/ui/popover";
import { EdCompEditInfo } from "./comp-edit-info";

export type CompPickerNode = {
  type: "folder" | "comp";
  name: string;
  id: string;
  idx: string;
  ext: boolean;
  render?: () => void;
};
export const compRenderPickerNode = (
  node: NodeModel<CompPickerNode>,
  prm: RenderParams,
  checked: boolean,
  onCheck: (item_id: string) => void,
  ctx_menu: {
    edit_id: string;
    closeEdit: () => void;
    activate: (arg: {
      event: React.MouseEvent<HTMLElement, MouseEvent>;
      comp_id: string;
    }) => void;
  },
  len?: number
) => {
  if (node.data?.type === "folder")
    return <RPNFolder node={node} prm={prm} len={len || 0} />;
  if (node.data?.type === "comp") {
    const item = node.data;
    const result = (
      <>
        <RPNComponent
          node={node}
          prm={prm}
          checked={checked}
          onCheck={onCheck}
          onRightClick={ctx_menu.activate}
        />
      </>
    );
    if (item.id === ctx_menu.edit_id) {
      return (
        <Popover
          open
          onOpenChange={(open) => {
            if (!open) ctx_menu.closeEdit();
          }}
          backdrop={false}
          content={
            <EdCompEditInfo node={node} close={() => ctx_menu.closeEdit()} />
          }
        >
          {result}
        </Popover>
      );
    }
    return result;
  }
  return <></>;
};
