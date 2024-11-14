import { DeepReadonly } from "popup/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViComp } from "./vi-comp";
import { ViItem } from "./vi-item";
import { useVi } from "./lib/store";
import { DIV_PROPS } from "./lib/gen-parts";
import { DIV_PROPS_OPT, ViMergedProps } from "./lib/types";

export const ViRender: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
  div_props?: (opt: DIV_PROPS_OPT) => DIV_PROPS;
  instance_id?: string;
  merged?: ViMergedProps;
  standalone?: string;
}> = ({ item, is_layout, div_props, instance_id, merged, standalone }) => {
  const { wrapper, ref } = useVi(
    ({ ref }) => ({
      wrapper: ref.wrapper,
      ref,
    }),
    standalone
  );

  if (item.hidden) return null;

  if (wrapper) {
    const Wrapper = wrapper;

    return (
      <Wrapper
        item={item as any}
        is_layout={is_layout}
        instance_id={instance_id}
        merged={merged}
        standalone={standalone}
        ViRender={item.component?.id ? ViComp : ViItem}
      />
    );
  }

  if (item.component?.id) {
    return (
      <ViComp
        item={item}
        merged={merged}
        is_layout={is_layout}
        div_props={div_props}
        standalone={standalone}
      />
    );
  } else {
    return (
      <ViItem
        item={item}
        is_layout={is_layout}
        div_props={div_props}
        merged={merged}
        instance_id={instance_id}
        standalone={standalone}
      />
    );
  }
};
