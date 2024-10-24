import { DeepReadonly } from "popup/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { LoadingSpinner } from "utils/ui/loading";
import { compArgs } from "./lib/comp-args";
import { DIV_PROPS } from "./lib/gen-parts";
import { parentCompArgs } from "./lib/parent-comp-args";
import { useVi } from "./lib/store";
import { DIV_PROPS_OPT } from "./lib/types";
import { ViItem } from "./vi-item";

export const ViComp: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
  div_props?: (opt: DIV_PROPS_OPT) => DIV_PROPS;
  __idx?: string | number;
  instance_id?: string;
}> = ({ item, is_layout, div_props, __idx, instance_id }) => {
  const { comps, instances, instantiate, ref_comp_props, parents, db, api, instanced } =
    useVi(({ state, ref, action }) => ({
      comps: ref.comps,
      load: ref.loader.comps,
      instances: state.comp.instances,
      loaded: state.comp.loaded,
      instantiate: action.instantiate_comp,
      ref_comp_props: ref.comp_props,
      parents: ref.item_parents,
      db: ref.db,
      api: ref.api,
      instanced: ref.instanced,
    }));

  const comp_id = item.component!.id;
  const loading_component = <LoadingSpinner />;

  if (!comps[comp_id]) {
    return loading_component;
  } else {
    if (!instances[item.id] || instanced[item.id] !== item) {
      instanced[item.id] = item;
      const parent_comp_args = parentCompArgs(parents, ref_comp_props, item.id);
      ref_comp_props[item.id] = compArgs(item, parent_comp_args, db, api);
      instantiate(item);
    }
  }
  const instance = instances[item.id];
  if (!instance) return loading_component;

  return (
    //@ts-ignore
    <ViItem
      item={instance}
      __idx={__idx}
      is_layout={is_layout}
      div_props={div_props}
      instance_id={item.id}
    />
  );
};
