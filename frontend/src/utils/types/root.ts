import { IItem } from "./item";

export type IRoot = {
  id: "root";
  type: "root";
  id_page?: string;
  responsive?: "mobile" | "desktop";
  childs: IItem[];
  component_ids?: string[];
};
