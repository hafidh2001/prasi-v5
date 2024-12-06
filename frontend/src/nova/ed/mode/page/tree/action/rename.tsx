import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";

export const edActionRename = (p: PG, item: IItem) => {
  setTimeout(() => {
    p.ui.tree.rename_id = item.id;
    p.render();
  }, 300);
};
