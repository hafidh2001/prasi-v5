import { IItem } from "utils/types/item";
import { parsePropForJsx } from "./flatten-tree";

export const loopItem = (
  items: IItem[],
  fn: (arg: {
    item: IItem;
    parent?: IItem;
    path_name: string[];
    path_id: string[];
  }) => void,
  opt?: { parent: IItem; path_name: string[]; path_id: string[] }
) => {
  const parent = opt?.parent;
  const path_name = opt?.path_name || [];
  const path_id = opt?.path_id || [];
  for (const item of items) {
    fn({
      item,
      parent,
      path_name: [...path_name, item.name],
      path_id: [...path_name, item.id],
    });
    if (item.component?.id) {
      const props = parsePropForJsx(item);
      for (const prop of Object.values(props)) {
        loopItem([prop], fn, {
          parent: item,
          path_name: [...path_name, item.name],
          path_id: [...path_name, item.id],
        });
      }
    } else {
      if (item.childs) {
        loopItem(item.childs, fn, {
          parent: item,
          path_name: [...path_name, item.name],
          path_id: [...path_name, item.id],
        });
      }
    }
  }
};
