import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViComponent } from "./vi-component";
import { ViItem } from "./vi-item";

export const ViRender: FC<{ item: IItem; is_layout: boolean }> = ({
  item,
  is_layout,
}) => {
  if (item.component?.id) {
    return <ViComponent item={item} is_layout={is_layout} />;
  }
  
  return <ViItem item={item} is_layout={is_layout} />;
};
