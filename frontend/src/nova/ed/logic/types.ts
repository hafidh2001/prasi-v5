import { component, page, site } from "prasi-db";
import { IItem } from "../../../utils/types/item";

export type ESite = Omit<site, "config"> & { config: { api_url: string } };

export type EPage = Omit<page, "content_tree"> & {
  content_tree: {
    childs: IItem[];
    component_ids: string[];
    id: string;
    id_page: string;
    responsive: "mobile" | "desktop";
    type: "root";
  };
};

export type EComp = {
  id: string;
  content_tree: IItem;
  id_component_group: string;
};

export type PropFieldKind =
  | "onChange"
  | "visible"
  | "gen"
  | "value"
  | "option"
  | "typings";

export type PNode = {
  item: IItem;
  parent?: {
    id: string;
    component?: {
      comp_id: string;
      instance_id: string;
      prop_name: string;
    };
  };
};
