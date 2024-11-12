import { DeepReadonly } from "popup/flow/runtime/types";
import { ReactElement, useEffect } from "react";
import { IItem } from "utils/types/item";
import { getVersion, proxy, ref } from "valtio";
import { local_name } from "./vi-local";
import { ViMergedProps } from "vi/lib/types";

export const ViLocalAutoRender = (opt: {
  name: string;
  value: any;
  effect: (local: any) => void;
  children: ReactElement;
  item: DeepReadonly<IItem>;
  local_value: Record<string, any>;
  local_render: Record<string, () => void>;
  merged: ViMergedProps;
}) => {
  const { local_render, local_value, item, value, effect, children } = opt;

  if (!local_value[opt.name]) {
    local_value[opt.name] = {
      __autorender: true,
      [local_name]: value[local_name],
      __version: 0,
      __item_id: item.id,
      proxy: proxy({
        ...value,
        render: ref(() => {
          console.warn(
            `🛟 Warning: local.render() is ignored in <Local> with auto_render.`
          );
        }),
      }),
    };
    local_value[opt.name].proxy.set = ref(local_value[opt.name].proxy);
  }

  opt.merged[opt.name] = local_value[opt.name];

  const internal = local_value[opt.name] as {
    __version: number;
    __autorender: boolean;
    __item_id: string;
    proxy: any;
  };

  const valtio_version = getVersion(internal.proxy) || 0;
  useEffect(() => {
    const should_render = internal.__version > 0;
    if (internal.__version !== valtio_version) {
      internal.__version = valtio_version;
      if (should_render) {
        local_render[item.id]?.();
      } else {
        effect(internal.proxy);
      }
    }
  }, [valtio_version]);

  return children;
};
