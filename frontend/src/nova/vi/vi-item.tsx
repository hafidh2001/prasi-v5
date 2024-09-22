import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { viDivProps } from "./lib/gen-parts";
import { ViChilds } from "./vi-child";
import { useVi } from "./lib/store";
import { ViScript } from "./vi-script";
import { compArgs } from "./lib/comp-args";

export const ViItem: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
  comp_args: any;
}> = ({ item, is_layout, comp_args }) => {
  const { page, db, api } = useVi(({ state, ref }) => ({
    page: state.page,
    db: ref.db,
    api: ref.api,
  }));

  const props = viDivProps(item, { mode: "desktop" });

  let item_comp_args = comp_args;
  if (item.component?.id) {
    item_comp_args = compArgs(item, comp_args, db, api);
  }

  let childs = null;
  if (is_layout && item.name === "children" && page) {
    childs = (
      <ViChilds
        childs={page.root.childs as any}
        is_layout={is_layout}
        comp_args={item_comp_args}
      />
    );
  } else {
    childs = (
      <ViChilds
        childs={item.childs as any}
        is_layout={is_layout}
        comp_args={item_comp_args}
      />
    );
  }

  if (item.adv?.js) {
    return (
      <ViScript
        item={item}
        childs={childs}
        props={props}
        comp_args={item_comp_args}
      />
    );
  }

  return <div {...props}>{childs}</div>;
};
