import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { useVi } from "./lib/store";
import { ViItem } from "./vi-item";
import { LoadingSpinner } from "utils/ui/loading";

export const ViComp: FC<{
  item: DeepReadonly<IItem>;
  is_layout: boolean;
  comp_args: any;
}> = ({ item, is_layout, comp_args }) => {
  const { comps, instances, instantiate } = useVi(({ state, ref, action }) => ({
    comps: ref.comps,
    load: ref.loader.comps,
    instances: state.comp.instances,
    loaded: state.comp.loaded,
    instantiate: action.instantiate_comp,
  }));

  const comp_id = item.component!.id;
  const loading_component = <LoadingSpinner />;

  if (!comps[comp_id]) {
    return loading_component;
  } else {
    if (!instances[item.id]) {
      instantiate(item);
    }
  }
  const instance = instances[item.id];
  if (!instance) return loading_component;

  return <ViItem item={item} is_layout={is_layout} comp_args={comp_args} />;
};
