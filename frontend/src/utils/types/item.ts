import { PFlow } from "popup/flow/runtime/types";
import { BasicItem, MetaItem } from "./meta";
import { FNAdv, FNComponent, FNLayout, FNLinkTag } from "./meta-fn";
import { EType, EValue } from "popup/script/expr/lib/type";

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
  vars?: Record<string, EType>;
  childs: IItem[];
} & MetaItem &
  BasicItem;

export type IVar = {
  default: EValue;
  promise?: boolean;
};
