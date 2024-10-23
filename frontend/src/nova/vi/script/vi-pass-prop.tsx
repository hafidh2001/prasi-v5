import { DeepReadonly } from "popup/flow/runtime/types";
import { IItem } from "utils/types/item";

export const createViPassProp = (
  item: DeepReadonly<IItem>,
  pass_props: Record<string, Record<string | number, any>>,
  __idx?: string | number,
  instance_id?: string
) => {
  return function (
    this: any,
    arg: { children: any } & Record<string, any>,
    ...props: any[]
  ) {
    const idx = arg.idx || "0";

    if (!pass_props[item.id]) {
      pass_props[item.id] = {};
    }

    if (!pass_props[item.id][idx]) {
      pass_props[item.id][idx] = {};
    }

    for (const [k, v] of Object.entries(arg)) {
      if (k === "children") continue;
      pass_props[item.id][idx][k] = v;
    }

    if (typeof __idx !== "undefined") {
      pass_props[item.id][idx].__idx = __idx;
    }

    let children = arg.children;
    if (isWritable(arg.children, "key")) {
      children.key = idx;
      children.props.__idx = idx;
      children.props.instance_id = instance_id;
    } else {
      children = {
        ...arg.children,
        key: idx,
        props: { ...arg.children.props, __idx: idx, instance_id },
      };
    }

    return children;
  };
};

function isWritable<T extends Object>(obj: T, key: keyof T) {
  const desc = Object.getOwnPropertyDescriptor(obj, key) || {};
  return Boolean(desc.writable);
}
