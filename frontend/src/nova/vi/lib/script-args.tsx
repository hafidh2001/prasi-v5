import { DeepReadonly } from "popup/flow/runtime/types";
import * as React from "react";
import { ReactElement } from "react";
import { IItem } from "utils/types/item";

export const scriptArgs = (opt: {
  item: DeepReadonly<IItem>;
  childs: ReactElement | null;
  props: React.ClassAttributes<HTMLDivElement> &
    React.HTMLAttributes<HTMLDivElement> & {
      inherit?: {
        style: IItem;
        className: string;
      };
    };
  result: { children: ReactElement | null };
}) => {
  const args: any = {
    React: React,
    props: opt.props,
    render(children: any) {
      opt.result.children = children;
    },
    children: opt.childs,
  };


  return args;
};
