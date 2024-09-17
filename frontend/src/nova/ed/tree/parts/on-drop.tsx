import { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { getNodeById } from "crdt/node/get-node-by-id";
import get from "lodash.get";
import { activateItem, active, getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { PNode } from "logic/types";
import { IItem } from "utils/types/item";

export const treeOnDrop: (
  p: PG,
  tree: NodeModel<PNode>[],
  options: DropOptions<PNode>
) => void = (p, tree, options) => {
  const { dragSource, dropTarget, relativeIndex, dragSourceId, dropTargetId } =
    options;

  if (
    dragSource?.data &&
    dropTarget &&
    typeof dragSourceId === "string" &&
    typeof dropTargetId === "string"
  ) {
    getActiveTree(p).update("Move item", ({ findNode, findParent, tree }) => {
      const from = findNode(dragSourceId);
      const from_parent = findParent(dragSourceId);
      const to = findNode(dropTargetId);

      if (from && typeof relativeIndex === "number") {
        let to_childs = null as null | IItem[];
        let from_childs = null as null | IItem[];

        if (from_parent) {
          from_childs = from_parent.item.childs;
        }

        if (to) {
          if (to.item.childs) {
            to_childs = to.item.childs;
          }
        } else if (from.item.type === "section") {
          to_childs = tree.childs;
          from_childs = tree.childs;
        }

        if (to_childs && from_childs) {
          const from_idx = from_childs.findIndex((e) => e.id === from.item.id);
          from_childs.splice(from_idx, 1);

          to_childs.splice(relativeIndex, 0, from.item);
        }
      }
    });

    activateItem(p, dragSourceId);
  }
};

export const treeCanDrop = (p: PG, arg: DropOptions<PNode>) => {
  const { dragSource, dragSourceId, dropTargetId, dropTarget } = arg;
  try {
    const parentSource: IItem | undefined = get(
      dragSource,
      "data.item.parent.parent"
    ) as any;
    if (parentSource && parentSource.id === "root") {
      return false;
    }
    if (dropTargetId === "root") {
      const ds = get(dragSource, "data.item") as IItem;
      if (ds && ds.type === "section") {
        return true;
      }
      return false;
    } else if (dragSource?.data && dropTarget?.data) {
      const from = (dragSource.data.item as IItem).type;
      const to = (dropTarget.data.item as IItem).type;
      if (from === "section" || from === "item") {
        let parentMeta: PNode | undefined = dropTarget.data;
        while (parentMeta) {
          if (parentMeta.item.id === dragSource.data.item.id) {
            return false;
          }
          if (parentMeta.parent?.id) {
            parentMeta = getNodeById(p, parentMeta.parent.id);
          } else {
            break;
          }
        }
      }

      if (
        to === "item" &&
        dropTarget.data.item.component?.id &&
        active.comp?.id !== dropTarget.data.item.component?.id
      ) {
        return false;
      }

      if (from === "section" || to === "text") {
        return false;
      } else if (from === "item") {
        if (to === "section" || to === "item") {
          return true;
        } else {
          return false;
        }
      } else if (from === "text") {
        if (to === "item" || to === "section") {
          return true;
        }
      }
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};
