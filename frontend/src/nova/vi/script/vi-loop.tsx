import { DeepReadonly } from "popup/flow/runtime/types";
import { IItem } from "utils/types/item";
import { ViMergedProps } from "vi/lib/types";

export const createViLoop = (
  item: DeepReadonly<IItem>,
  children: any,
  merged: ViMergedProps
) => {
  return ({
    bind: { list, loop_name: name, key },
  }: {
    bind: {
      list: any[];
      loop_name: string;
      key: (arg: { item: any; index: number }) => any;
    };
  }) => {
    if (!list || (list && !Array.isArray(list))) return null;

    return list.map((item, index) => {
      const new_key = key ? key({ item, index }) : index;
      const _merged = {
        ...merged,
        [name]: item,
        [`${name}_idx`]: index,
        __internal: {
          ...merged.__internal,
          [name]: { from_id: item.id, type: "loop" },
          [`${name}_idx`]: { from_id: item.id, type: "loop" },
        },
      };

      if (isWritable(children, "key")) {
        children.key = new_key;
        children.props.merged = _merged;
        return children;
      }

      return {
        ...children,
        key: new_key,
        props: { ...children.props, merged: _merged },
      };
    });
  };
};

function isWritable<T extends Object>(obj: T, key: keyof T) {
  const desc = Object.getOwnPropertyDescriptor(obj, key) || {};
  return Boolean(desc.writable);
}
