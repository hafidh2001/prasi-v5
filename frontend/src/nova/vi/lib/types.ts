import { EPage } from "logic/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { ViRender } from "vi/vi-render";
import { ViRef } from "./store";

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
  db: any;
  api: any;
  mode: "desktop" | "mobile";
  wrapper?: ViWrapperComp;
  loader: {
    pages: (ids: string[]) => Promise<void>;
    comps: (ids: string[]) => Promise<void>;
  };
  enable_preload?: boolean;
  enable_cache_js?: boolean;
  set_ref?: (ref: ViRef) => void;
};

export type ViWrapperComp = FC<{
  item: IItem;
  is_layout: boolean;
  ViRender: typeof ViRender;
  __idx?: string | number;
}>;
