import { CompTree } from "crdt/load-comp-tree";
import { PG } from "./ed-global";
import { indentTree, useTreeIndent } from "../tree/parts/use-indent";

export const getActiveTree = (p: PG) => {
  return active.comp ? active.comp : p.page.tree;
};

export const activateItem = (p: PG, id: string) => {
  setTimeout(() => {
    active.item_id = id;
    p.render();
    setTimeout(() => {
      indentTree(p);
    }, 50);
  });
};

export const active = {
  get item_id() {
    return localStorage.getItem("prasi-active-item-id") || "";
  },
  set item_id(value: string) {
    localStorage.setItem("prasi-active-item-id", value);
  },
  comp: null as null | CompTree,
  hover: { id: "", tree: false },
  script_nav: {
    list: [] as {
      item_id: string;
      comp_id?: string;
      instance?: { item_id: string; comp_id?: string };
    }[],
    idx: -1,
  },
  instance: {
    get comp_id() {
      if (target.instance_comp_id === false) {
        target.instance_comp_id =
          localStorage.getItem("prasi-instance-comp-id") || "";
      }
      return target.instance_comp_id || "";
    },
    set comp_id(val: string) {
      localStorage.setItem("prasi-instance-comp-id", val || "");
      target.instance_comp_id = val || "";
    },
    get item_id() {
      if (target.instance_item_id === false) {
        target.instance_item_id =
          localStorage.getItem("prasi-instance-item-id") || "";
      }
      return target.instance_item_id || "";
    },
    set item_id(val: string) {
      localStorage.setItem("prasi-instance-item-id", val || "");
      target.instance_item_id = val || "";
    },
  },
};

const target = {
  active_id: false as any,
  comp_id: false as any,
  instance_comp_id: false as any,
  instance_item_id: false as any,
};
