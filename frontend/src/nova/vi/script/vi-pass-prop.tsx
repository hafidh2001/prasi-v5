import { DeepReadonly } from "popup/flow/runtime/types";
import { cloneElement, isValidElement } from "react";
import { IItem } from "utils/types/item";
import { ViMergedProps } from "vi/lib/types";

export const createViPassProp = (
  item: DeepReadonly<IItem>,
  merged: ViMergedProps
) => {
  return function (this: any, arg: { children: any } & Record<string, any>) {
    const idx = arg.idx || "0";

    for (const [k, v] of Object.entries(arg)) {
      if (k !== "children") {
        merged[k] = v;
        merged.__internal[k] = { from_id: item.id, type: "passprop" };
      }
    }
    
    return cloneElement(arg.children, {
      key: idx,
      ...(arg.children.props || {}),
      merged: merged,
    });
  };
};
