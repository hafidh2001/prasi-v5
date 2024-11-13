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

export type DIV_PROPS_OPT = { item: IItem; ref: ViRef; instance_id?: string };

export type ViComps = Record<string, IItem>;

export type ViProp = {
  page: ViPage;
  layout?: ViPage;
  comps: ViComps;
  db: any;
  api: any;
  mode: "desktop" | "mobile";
  wrapper?: ViWrapperType;
  loader: {
    pages: (ids: string[]) => Promise<void>;
    comps: (ids: string[]) => Promise<void>;
  };
  edit_comp_id?: string;
  enable_preload?: boolean;
  vscode_exports: Record<string, any>;
  setRef?: (ref: ViRef) => void;
};

export type ViWrapperType = FC<{
  item: IItem;
  is_layout: boolean;
  ViRender: typeof ViRender;
  merged?: ViMergedProps;
  instance_id?: string;
}>;

export type ViMergedProps = {
  __internal: Record<
    string,
    { type: "loop" | "passprop" | "local"; from_id: string }
  >;
} & Record<string, any>;
