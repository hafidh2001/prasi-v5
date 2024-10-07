import { PFlow } from "popup/flow/runtime/types";
import { EBaseType, EType } from "../../nova/ed/right/vars/lib/type";
import { BasicItem, MetaItem } from "./meta";
import { FNAdv, FNComponent, FNLayout, FNLinkTag } from "./meta-fn";

export type IItem = {
  layout?: FNLayout;
  linktag?: FNLinkTag;
  mobile?: IItem;
  adv?: FNAdv;
  type: "item" | "section" | "text";
  component?: FNComponent;
  tree_hidden?: boolean;
  text?: string;
  html?: string;
  events?: Record<string, { flow: PFlow }>;
  vars?: Record<string, IVar<any>>;
  childs: IItem[];
} & MetaItem &
  BasicItem;

export type IVar<T extends EType> = {
  type: T;
  default?: any;
  promise?: boolean;
  history: {
    type: Partial<Record<EBaseType, Record<string, EType>>>;
    value: Partial<Record<EBaseType, any>>;
  };
};
