import { DeepReadonly } from "popup/flow/runtime/types";
import { useEffect, useRef } from "react";
import { IItem } from "utils/types/item";
import { getVersion, proxy, ref, useSnapshot } from "valtio";
import { local_name } from "vi/lib/parent-local-args";

export const ViLocalAutoRender = (opt: {
  name: string;
  value: any;
  effect: (local: any) => void;
  children: any;
  item: DeepReadonly<IItem>;
  local_value: Record<string, any>;
  local_render: Record<string, () => void>;
}) => {
  const { local_render, local_value, item, value, effect, children } = opt;

  if (!local_value[item.id]) {
    local_value[item.id] = {
      __autorender: true,
      [local_name]: value[local_name],
      __version: 0,
      proxy: proxy({
        ...value,
        render: ref(() => {
          console.warn(
            `🛟 Warning: local.render() is ignored in <Local> with auto_render.`
          );
        }),
      }),
    };
  }
  const internal = local_value[item.id] as {
    __version: number;
    __autorender: boolean;
    proxy: any;
  };

  useSnapshot(internal.proxy);

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
