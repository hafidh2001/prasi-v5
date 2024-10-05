import { DeepReadonly } from "popup/script/flow/runtime/types";
import { IItem } from "utils/types/item";

export const createViPassProp = (
  item: DeepReadonly<IItem>,
  pass_props: Record<string, Record<string | number, any>>
) => {
  return (arg: { children: any } & Record<string, any>) => {
    const idx = arg.idx || "0";
    for (const [k, v] of Object.entries(arg)) {
      if (k === "children") continue;
      if (!pass_props[item.id]) {
        pass_props[item.id] = {};
      }

      if (!pass_props[item.id][idx]) {
        pass_props[item.id][idx] = {};
      }
      pass_props[item.id][idx][k] = v;
    }

    return arg.children;
  };
};
