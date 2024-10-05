import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { DIV_PROPS, viDivProps } from "./lib/gen-parts";
import { useVi } from "./lib/store";
import { ViChilds } from "./vi-child";
import { ViScript } from "./vi-script";

export const ViItem: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
  div_props?: (item: IItem) => DIV_PROPS;
  __idx?: string | number;
}> = ({ item, is_layout, div_props, __idx }) => {
  const { page, mode, ts } = useVi(({ state, ref }) => ({
    page: state.page,
    db: ref.db,
    api: ref.api,
    ts: state.local_render[item.id],
    mode: state.mode,
  }));

  const props = viDivProps(item, { mode, div_props: div_props?.(item as any) });

  let childs = null;
  if (is_layout && item.name === "children" && page) {
    childs = <ViChilds __idx={__idx} item={page.root} is_layout={is_layout} />;
  } else {
    if (item.childs) {
      childs = <ViChilds __idx={__idx} item={item} is_layout={is_layout} />;
    } else {
      childs = null;
      if (item.html) {
        props.dangerouslySetInnerHTML = { __html: item.html };
      }
    }
  }

  if (item.adv?.js) {
    return (
      <ViScript
        __idx={__idx}
        item={item}
        childs={childs}
        props={props}
        ts={ts}
      />
    );
  }

  return <div {...props}>{childs ? childs : null}</div>;
};
