import { DeepReadonly } from "popup/flow/runtime/types";
import { useEffect, useRef } from "react";
import { IItem } from "utils/types/item";
import { getVersion, proxy, ref, useSnapshot } from "valtio";

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
  const internal = useRef({ version: 0 }).current;

  if (!local_value[item.id]) {
    local_value[item.id] = {
      __autorender: true,
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

  useEffect(() => {
    effect(local_value[item.id].proxy);
  }, []);

  const valtio_version = getVersion(local_value[item.id].proxy) || 0;
  useEffect(() => {
    if (internal.version === 0) {
      internal.version = valtio_version;
    } else {
      internal.version = valtio_version;
      local_render[item.id]?.();
    }
  }, [valtio_version]);

  return children;
};
