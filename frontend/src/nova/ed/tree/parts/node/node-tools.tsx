import { IItem } from "../../../../../utils/types/item";
import { active } from "../../../logic/active";

export const parseNodeState = ({ item }: { item: IItem }) => {
  let is_active = false;
  let is_hover = false;
  let is_component = false;

  if (item) {
    if (active.item_id === item.id) {
      is_active = true;
    }

    if (active.hover.id === item.id) {
      is_hover = true;
    }
    is_component = !!item.component?.id;
  }

  return { is_active, is_component, is_hover };
};
