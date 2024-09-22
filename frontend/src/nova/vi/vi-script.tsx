import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC, ReactElement, useRef } from "react";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { scriptArgs } from "./lib/script-args";
import { createViLocal } from "./script/vi-local";

export const ViScript: FC<{
  item: DeepReadonly<IItem>;
  childs: ReactElement;
  props: React.ClassAttributes<HTMLDivElement> &
    React.HTMLAttributes<HTMLDivElement> & {
      inherit?: {
        style: IItem;
        className: string;
      };
    };
  comp_args: any;
}> = ({ item, childs, props, comp_args }) => {
  const local = useRef<any>({}).current;
  if (item !== local.item) {
    local.item = item;
    local.Local = createViLocal(item);
  }

  const result = { children: null };
  const script_args = scriptArgs({ item, childs, props, result });
  const final_args = {
    ...comp_args,
    ...script_args,
    Local: local.Local,
  };

  const js = item.adv!.jsBuilt || "";
  const fn = new Function(...Object.keys(final_args), js);

  try {
    fn(...Object.values(final_args));

    return result.children;
  } catch (e) {
    console.log(fn);
    throw e;
  }
};
