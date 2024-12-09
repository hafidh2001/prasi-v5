import { DeepReadonly } from "popup/flow/runtime/types";
import { isValidElement, useEffect, useRef } from "react";
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
    deps?: any[];
  }) => {
    let children = opt.children || {};

    if (Array.isArray(opt.children)) {
      children = opt.children.map((e) => {
        if (isValidElement(e)) {
          return { ...e, props: { ...(e.props || {}), merged } };
        }
        return e;
      });
    } else {
      children = {
        ...children,
        props: { ...(children.props || {}), merged },
      };
    }

    const deps = useRef({ init: false }).current;

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

    const resetLocal = () => {
      local_value[opt.name] = {
        ...opt.value,
        render() {
          local_render[item.id]();
        },
      };
    };
    if (Object.keys(local_value).length === 0) {
      resetLocal();
    }
    for (const [k, v] of Object.entries(local_value)) {
      merged[k] = v;
    }

    useEffect(() => {
      opt.effect(local_value[opt.name]);
    }, []);

    useEffect(() => {
      if ((opt.deps || []).length > 0) {
        if (!deps.init) {
          deps.init = false;
          return;
        } else {
          resetLocal();
          opt.effect(local_value[opt.name]);
        }
      }
    }, opt.deps || []);

    return children;
  };
};
