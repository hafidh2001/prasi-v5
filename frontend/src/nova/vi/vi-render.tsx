import { DeepReadonly } from "popup/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViComp } from "./vi-comp";
import { ViItem } from "./vi-item";
import { useVi } from "./lib/store";
import { DIV_PROPS } from "./lib/gen-parts";

export const ViRender: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
  div_props?: (item: IItem) => DIV_PROPS;
  __idx?: string | number;
}> = ({ item, is_layout, div_props, __idx }) => {
  const { wrapper } = useVi(({ ref }) => ({
    wrapper: ref.wrapper,
  }));

  if (wrapper) {
    const Wrapper = wrapper;
    return (
      <Wrapper
        item={item as any}
        is_layout={is_layout}
        __idx={__idx}
        ViRender={item.component?.id ? ViComp : ViItem}
      />
    );
  }
  
  if (item.component?.id) {
    return (
      <ViComp
        item={item}
        __idx={__idx}
        is_layout={is_layout}
        div_props={div_props}
      />
    );
  } else {
    return (
      <ViItem
        item={item}
        __idx={__idx}
        is_layout={is_layout}
        div_props={div_props}
      />
    );
  }
};
