import { FC } from "react";
import { IItem } from "utils/types/item";
import { viDivProps } from "./lib/gen-parts";
import { ViChilds } from "./vi-child";

export const ViItem: FC<{ item: IItem; is_layout: boolean }> = ({
  item,
  is_layout,
}) => {
  const props = viDivProps(item, { mode: "desktop" });
  return (
    <div {...props}>
      {item.childs && <ViChilds childs={item.childs} is_layout={is_layout} />}
    </div>
  );
};
