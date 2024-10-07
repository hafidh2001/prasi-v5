import { PFlow } from "popup/flow/runtime/types";
import { BasicItem, MetaItem } from "./meta";
import { FNAdv, FNComponent, FNLayout, FNLinkTag } from "./meta-fn";
import { EType, EValue } from "../../nova/ed/right/vars/lib/type";

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
};
