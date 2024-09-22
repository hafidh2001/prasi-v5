import { FC } from "react";
import { IItem } from "utils/types/item";
import { viDivProps } from "./lib/gen-parts";
import { ViChilds } from "./vi-child";
import { useVi } from "./lib/store";

export const ViComponent: FC<{ item: IItem; is_layout: boolean }> = ({
  item,
  is_layout,
}) => {
  const { comps } = useVi(({ state, ref }) => ({
    comps: state.comps,
    load: ref.loader.comps,
  }));
  const comp_id = item.component!.id;

  if (!comps[comp_id]) {
    return null;
  }

  const comp = comps[comp_id];
  const props = viDivProps(item, { mode: "desktop" });

  return (
    <div {...props}>
      {item.childs && <ViChilds childs={item.childs} is_layout={is_layout} />}
    </div>
  );
};
