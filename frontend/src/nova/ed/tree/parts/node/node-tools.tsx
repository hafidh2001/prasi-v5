import { IItem } from "../../../../../utils/types/item";
import { active } from "../../../logic/active";

export const parseNodeState = ({ item }: { item: IItem }) => {
  let is_active = false;
  if (active.item_id === item.id) {
    is_active = true;
  }

  let is_hover = false;
  if (active.hover.id === item.id) {
    is_hover = true;
  }
  let is_component = item.component?.id;

  return { is_active, is_component, is_hover };
};
