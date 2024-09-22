import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViRender } from "./vi-render";

export const ViChilds: FC<{
  childs: DeepReadonly<IItem>[];
  is_layout: boolean;
  comp_args: any;
}> = ({ childs, is_layout, comp_args }) => {
  return childs.map((item) => {
    return (
      <ViRender
        key={item.id}
        item={item}
        is_layout={is_layout}
        comp_args={comp_args}
      />
    );
  });
};
