import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { viDivProps } from "./lib/gen-parts";
import { useVi } from "./lib/store";
import { ViChilds } from "./vi-child";
import { ViScript } from "./vi-script";

export const ViItem: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
}> = ({ item, is_layout }) => {
  const { page, mode, ts } = useVi(({ state, ref }) => ({
    page: state.page,
    db: ref.db,
    api: ref.api,
    ts: state.local_render[item.id],
    mode: state.mode,
  }));

  const props = viDivProps(item, { mode });

  let childs = null;
  if (is_layout && item.name === "children" && page) {
    childs = <ViChilds item={page.root} is_layout={is_layout} />;
  } else {
    if (item.childs) {
      childs = <ViChilds item={item} is_layout={is_layout} />;
    } else {
      childs = null;
      if (item.html) {
        props.dangerouslySetInnerHTML = { __html: item.html };
      }
    }
  }

  if (item.adv?.js) {
    return <ViScript item={item} childs={childs} props={props} ts={ts} />;
  }

  return <div {...props}>{childs}</div>;
};
