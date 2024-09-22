import { DeepReadonly } from "popup/script/flow/runtime/types";
import { useEffect } from "react";
import { IItem } from "utils/types/item";
import { useVi } from "vi/lib/store";

export const createViLocal = (item: DeepReadonly<IItem>) => {
  return (arg: {
    name: string;
    value: any;
    effect: (local: any) => void;
    children: any;
  }) => {
    const local = useVi(({ state, ref }) => ({
      ts: state.local_render,
      value: ref.local_value,
    }));

    if (!local.ts[item.id]) {
      local.value[item.id] = {
        ...arg.value,
        render() {
          local.update((state) => {
            state.local_render[item.id] = Date.now();
          });
        },
      };
    }

    useEffect(() => {
      arg.effect(local.value[item.id]);
    });

    return <>{arg.children}</>;
  };
};
