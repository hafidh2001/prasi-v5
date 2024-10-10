import { PFlow } from "popup/flow/runtime/types";
import { EventType } from "../../nova/ed/right/events/ed-event-types";
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
  events?: Record<EventType, { flow: PFlow }>;
  vars?: Record<string, IVar<any>>;
  loop?: IFlowOrVar;
  content?: IFlowOrVar;
  childs: IItem[];
} & MetaItem &
  BasicItem;

type ITEM_ID = string;
type PROP_NAME = string;
type VAR_PATH = string;
type FLOW_NODE_ID = string;

export type IFlowOrVar = { mode: "var" | "flow"; flow?: PFlow; var?: VarUsage };
export type IVar<T extends EType> = {
  id: string;
  name: string;
  type: T;
  default?: any;
  promise?: boolean;
  usage: Record<
    ITEM_ID,
    Partial<{
      event: Record<EventType, FLOW_NODE_ID[]>;
      loop: boolean;
      content: boolean;
      props: Record<PROP_NAME, FLOW_NODE_ID[]>;
    }>
  >;
  history: {
    type: Partial<Record<EBaseType, Record<VAR_PATH, EType>>>;
    value: Partial<Record<EBaseType, any>>;
  };
};

export type VarUsage = {
  var_id: string;
  path?: VAR_PATH[];
  error?: string;
};
