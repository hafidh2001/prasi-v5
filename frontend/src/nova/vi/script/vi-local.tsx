import { DeepReadonly } from "popup/flow/runtime/types";
import { useEffect } from "react";
import { IItem } from "utils/types/item";
import { ViMergedProps } from "vi/lib/types";
import { ViLocalAutoRender } from "./vi-local-auto-render";

export const render_mode = Symbol("render_mode");
export const local_name = Symbol("local_name");

export const createViLocal = (
  item: DeepReadonly<IItem>,
  local_value: Record<string, any>,
  local_render: Record<string, () => void>,
  merged: ViMergedProps
) => {
  return (opt: {
    name: string;
    value: any;
    proxy?: any;
    effect: (local: any) => void;
    children: any;
  }) => {
    let children = opt.children || {};
    children = {
      ...children,
      props: { ...(children.props || {}), merged },
    };

    if (opt.value[render_mode] === "auto") {
      return (
        <ViLocalAutoRender
          {...opt}
          children={children}
          item={item}
          local_render={local_render}
          local_value={local_value}
          merged={merged}
        />
      );
    }

    if (Object.keys(local_value).length === 0) {
      local_value[opt.name] = {
        ...opt.value,
        render() {
          local_render[item.id]();
        },
      };
    }
    for (const [k, v] of Object.entries(local_value)) {
      merged[k] = v;
    }

    useEffect(() => {
      opt.effect(local_value[item.id]);
    }, []);

    return children;
  };
};
