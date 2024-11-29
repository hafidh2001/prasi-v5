import { DeepReadonly } from "popup/flow/runtime/types";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
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
    const internal_item_ref = useRef({ map: new WeakMap(), count: 0 });
    const item_ref = internal_item_ref.current;
    const item_map = internal_item_ref.current.map;

    const [, render] = useState({});
    useEffect(() => {
      if (item_ref.count > 0) {
        internal_item_ref.current = { map: new WeakMap(), count: 0 };
        render({});
      }
    }, [children]);

    if (!list || (list && !Array.isArray(list))) return null;

    return list.map((item, index) => {
      if (item_map.has(item)) return item_map.get(item);
      else {
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

        const result = cloneElement(children, {
          key: new_key,
          ...(children.props || {}),
          merged: _merged,
        });
        item_ref.count++;
        if (typeof item === "object" && item) {
          item_map.set(item, result);
        }
        return result;
      }
    });
  };
};
