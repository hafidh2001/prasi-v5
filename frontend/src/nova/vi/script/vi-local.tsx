import { DeepReadonly } from "popup/flow/runtime/types";
import { useEffect } from "react";
import { IItem } from "utils/types/item";
import { ViLocalAutoRender } from "./vi-local-auto-render";

export const createViLocal = (
  item: DeepReadonly<IItem>,
  local_value: Record<string, any>,
  local_render: Record<string, () => void>
) => {
  return (opt: {
    name: string;
    value: any;
    auto_render?: boolean;
    effect: (local: any) => void;
    children: any;
  }) => {
    if (opt.auto_render) {
      return (
        <ViLocalAutoRender
          {...opt}
          item={item}
          local_render={local_render}
          local_value={local_value}
        />
      );
    }

    if (!local_value[item.id]) {
      if (!local_value[item.id]) {
        local_value[item.id] = {};
      }
      local_value[item.id] = {
        ...opt.value,
        render() {
          local_render[item.id]();
        },
      };
    }

    useEffect(() => {
      opt.effect(local_value[item.id]);
    }, []);

    return opt.children;
  };
};
