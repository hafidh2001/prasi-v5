import { DeepReadonly } from "popup/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViRender } from "./vi-render";
import { useVi } from "./lib/store";
import { ViMergedProps } from "./lib/types";

export const ViChilds: FC<{
  item: DeepReadonly<{ id: string; childs: IItem[] }>;
  is_layout: boolean;
  instance_id?: string;
  merged?: ViMergedProps;
  standalone?: string;
}> = ({ item, is_layout, instance_id, merged, standalone }) => {
  const { parents } = useVi(({ state, ref }) => ({
    parents: ref.item_parents,
  }));

  const childs = item.childs;
  return childs.map((child) => {
    parents[child.id] = item.id;
    return (
      <ViRender
        key={child.id}
        merged={merged}
        instance_id={instance_id}
        item={child}
        is_layout={is_layout}
        standalone={standalone}
      />
    );
  });
};
