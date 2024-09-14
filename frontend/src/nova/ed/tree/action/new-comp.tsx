import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";

export const edActionNewComp = (
  p: PG,
  item: IItem,
  e: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  p.ui.popup.comp_group = {
    mouse_event: e,
    async on_pick(group_id) {
      const comp = await _db.component.create({
        data: {
          content_tree: item,
          id_component_group: group_id,
          name: item.name,
        },
        select: { id: true },
      });

      getActiveTree(p).update(({ findParent }) => {
        const node = findParent(item.id);
        if (node) {
          node.item.component = { id: comp.id, props: {} };
        }
      });
    },
  };
};
