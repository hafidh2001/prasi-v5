import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViRender } from "./vi-render";
import { useVi } from "./lib/store";

export const ViChilds: FC<{
  item: DeepReadonly<{ id: string; childs: IItem[] }>;
  is_layout: boolean;
}> = ({ item, is_layout }) => {
  const { parents } = useVi(({ state, ref }) => ({
    parents: ref.item_parents,
  }));

  const childs = item.childs;
  return childs.map((child) => {
    parents[child.id] = item.id;
    return <ViRender key={child.id} item={child} is_layout={is_layout} />;
  });
};
