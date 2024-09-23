import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViComp } from "./vi-comp";
import { ViItem } from "./vi-item";

export const ViRender: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
}> = ({ item, is_layout }) => {

  if (item.component?.id) {
    return <ViComp item={item} is_layout={is_layout} />;
  }

  return <ViItem item={item} is_layout={is_layout} />;
};
