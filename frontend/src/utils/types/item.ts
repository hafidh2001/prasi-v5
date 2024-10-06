import { PFlow } from "popup/flow/runtime/types";
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
  childs: IItem[];
} & MetaItem &
  BasicItem;
