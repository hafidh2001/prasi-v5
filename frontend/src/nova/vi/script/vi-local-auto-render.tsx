import { DeepReadonly } from "popup/flow/runtime/types";
import { useEffect } from "react";
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
  const { local_render, local_value, item, name, value, effect, children } =
    opt;

  if (!local_value[item.id]) {
    local_value[item.id] = proxy({
      ...value,
      render: ref(() => {
        console.warn(
          `🛟 Warning: local.render() is ignored in <Local> with auto_render.`
        );
      }),
    });
  }

  const local = useSnapshot(local_value[item.id]);
  useEffect(() => {
    effect(local);
  }, []);

  useEffect(() => {
    local_render[item.id]?.();
  }, [getVersion(local_value[item.id])]);

  return children;
};
