import { EPage } from "logic/types";
import { IItem } from "utils/types/item";

export type ViPage = {
  id: string;
  root: EPage["content_tree"];
  url: string;
};

export type ViComps = Record<string, IItem>;

export type ViProp = {
  page: ViPage;
  layout?: ViPage;
  comps: ViComps;
  db: any,
  api: any,
  mode: "desktop" | "mobile";
  loader: {
    pages: (ids: string[]) => Promise<void>;
    comps: (ids: string[]) => Promise<void>;
  };
  enablePreload?: boolean;
};
