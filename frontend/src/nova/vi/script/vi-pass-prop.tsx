import { DeepReadonly } from "popup/flow/runtime/types";
import { isValidElement } from "react";
import { IItem } from "utils/types/item";
import { ViMergedProps } from "vi/lib/types";

export const createViPassProp = (
  item: DeepReadonly<IItem>,
  merged: ViMergedProps
) => {
  return function (this: any, arg: { children: any } & Record<string, any>) {
    const idx = arg.idx || "0";

    let children = arg.children;

    for (const [k, v] of Object.entries(arg)) {
      if (k !== "children") {
        merged[k] = v;
        merged.__internal[k] = { from_id: item.id, type: "passprop" };
      }
    }

    if (isWritable(arg.children, "key")) {
      children.key = idx;
      children.props.merged = merged;
    } else if (isValidElement(arg.children)) {
      children = {
        ...arg.children,
        key: idx,
        props: { ...(arg.children.props || {}), merged: merged },
      };
    }

    return children;
  };
};

function isWritable<T extends Object>(obj: T, key: keyof T) {
  const desc = Object.getOwnPropertyDescriptor(obj, key) || {};
  return Boolean(desc.writable);
}
