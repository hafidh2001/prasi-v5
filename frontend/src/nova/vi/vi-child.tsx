import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViRender } from "./vi-render";

export const ViChilds: FC<{ childs: IItem[]; is_layout: boolean }> = ({
  childs,
  is_layout,
}) => {
  return childs.map((item) => {
    return <ViRender key={item.id} item={item} is_layout={is_layout} />;
  });
};
