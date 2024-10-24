import { IItem } from "utils/types/item";
import { parsePropForJsx } from "./flatten-tree";
import { active } from "logic/active";

export const loopItem = (
  items: IItem[],
  opt: {},
  fn: (arg: {
    item: IItem;
    parent?: IItem;
    path_name: string[];
    path_id: string[];
  }) => void,
  recursive?: {
    parent: IItem;
    parent_comp?: IItem;
    path_name: string[];
    path_id: string[];
  }
) => {
  const parent = recursive?.parent;
  const path_name = recursive?.path_name || [];
  const path_id = recursive?.path_id || [];

  for (const item of items) {
    fn({
      item,
      parent,
      path_name: [...path_name, item.name],
      path_id: [...path_id, item.id],
    });
    if (item.component?.id) {
      const props = parsePropForJsx(item);
      for (const prop of Object.values(props)) {
        loopItem([prop], opt, fn, {
          parent: item,
          parent_comp: item,
          path_name: [...path_name, item.name],
          path_id: [...path_id, item.id],
        });
      }

      if (item.childs && active.comp_id === item.component.id) {
        loopItem(item.childs, opt, fn, {
          parent: item,
          parent_comp: item,
          path_name: [...path_name, item.name],
          path_id: [...path_id, item.id],
        });
      }
    } else {
      if (item.childs) {
        loopItem(item.childs, opt, fn, {
          parent: item,
          parent_comp: recursive?.parent_comp,
          path_name: [...path_name, item.name],
          path_id: [...path_id, item.id],
        });
      }
    }
  }
};
