import { loadCompTree } from "crdt/load-comp-tree";
import { decorateEComp } from "crdt/node/load-child-comp";
import { active, getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";
import { createId } from "@paralleldrive/cuid2";
export const edActionNewComp = (
  p: PG,
  item: IItem,
  e: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  p.ui.popup.comp_group = {
    mouse_event: e,
    on_close() {},
    async on_pick(group_id) {
      if (p.sync) {
        p.ui.comp.creating_id = item.id;
        p.render();

        const comp = await _db.component.create({
          data: {
            content_tree: { ...item, id: createId() },
            name: item.name,
            component_group: {
              connect: { id: group_id },
            },
          },
          select: { id: true },
        });

        getActiveTree(p).update(({ findNode }) => {
          const node = findNode(item.id);
          if (node) {
            node.item.component = { id: comp.id, props: {} };
          }
        });

        p.comp.loaded[comp.id] = decorateEComp({
          content_tree: item,
          id: comp.id,
          id_component_group: group_id,
        });

        p.ui.comp.creating_id = "";
        p.render();

        active.comp = await loadCompTree({
          sync: p.sync,
          id: comp.id,
          on_update(ctree) {
            p.comp.loaded[comp.id].content_tree = ctree;
            p.render();
          },
        });
        p.render();
      }
    },
  };
};