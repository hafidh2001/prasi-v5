import { EPage } from "logic/types";
import { DeepReadonly } from "popup/script/flow/runtime/types";
import { IItem } from "utils/types/item";

export type ViPage = {
  id: string;
  content_tree: EPage["content_tree"];
  url: string;
};

export type ViComps = Record<string, IItem>;

export type ViProp = {
  page: ViPage;
  layout?: ViPage;
  comps: ViComps;
  mode: "desktop" | "mobile";
  loader: {
    pages: (ids: string[]) => Promise<void>;
    comps: (ids: string[]) => Promise<void>;
  };
  enablePreload?: boolean;
};
