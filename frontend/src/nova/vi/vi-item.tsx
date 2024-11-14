import { DeepReadonly } from "popup/flow/runtime/types";
import { FC, useState } from "react";
import { IItem } from "utils/types/item";
import { DIV_PROPS, viDivProps } from "./lib/gen-parts";
import { useVi } from "./lib/store";
import { ViChilds } from "./vi-child";
import { ViScript } from "./vi-script";
import { DIV_PROPS_OPT, ViMergedProps } from "./lib/types";

export const ViItem: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
  div_props?: (opt: DIV_PROPS_OPT) => DIV_PROPS;
  merged?: ViMergedProps;
  instance_id?: string;
  standalone?: string;
}> = ({ item, is_layout, div_props, instance_id, merged, standalone }) => {
  const { page, mode, ref } = useVi(({ state, ref, action }) => ({
    page: ref.page,
    db: ref.db,
    api: ref.api,
    mode: ref.mode,
    ref,
  }));
  const [, render] = useState({});

  const props = viDivProps(item, {
    mode,
    div_props: div_props?.({ item: item as any, ref, instance_id }),
  });

  let childs = null;
  if (is_layout && item.name === "children" && page) {
    childs = (
      //@ts-ignore
      <ViChilds
        item={page.root}
        merged={merged}
        instance_id={instance_id}
        is_layout={is_layout}
        standalone={standalone}
      />
    );
  } else {
    if (item.type === "text") {
      childs = null;
      if (!item.adv?.js) {
        props.dangerouslySetInnerHTML = { __html: item.html || "" };
      } else {
        delete props.contentEditable;
        delete props.dangerouslySetInnerHTML;
      }
    } else {
      if (item.childs) {
        childs = (
          <ViChilds
            item={item}
            instance_id={instance_id}
            is_layout={is_layout}
            standalone={standalone}
          />
        );
      }
    }
  }

  if (item.adv?.js) {
    return (
      <ViScript
        item={item}
        childs={childs}
        merged={merged}
        props={props}
        instance_id={instance_id}
        render={() => render({})}
        standalone={standalone}
      />
    );
  }

  return <div {...props}>{childs ? childs : null}</div>;
};
