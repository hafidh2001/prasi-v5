import { TreeMethods } from "@minoru/react-dnd-treeview";
import { createClient } from "../../../utils/sync/client";
import { compTree } from "../crdt/comp-tree";
import { pageTree } from "../crdt/page-tree";
import { EComp, EPage, ESite } from "./types";

export const EDGlobal = {
  mode: "" as "desktop" | "mobile",
  user: { id: "", username: "", client_id: "" },
  status: "init" as
    | "init"
    | "load-site"
    | "reload"
    | "site-not-found"
    | "page-not-found"
    | "ready"
    | "no-site",
  site: { config: {} } as ESite,
  page: {
    cur: null as unknown as EPage,
    tree: null as unknown as ReturnType<typeof pageTree>,
  },
  comp: {
    raw: {} as Record<string, EComp>,
    loaded: {} as Record<string, ReturnType<typeof compTree>>,
  },
  ui: {
    tree: {
      rename_id: "",
      open_all: false,
      ref: null as null | TreeMethods,
      prevent_indent: false,
      expanded: {} as Record<string, string[]>,
      search: {
        value: "",
        mode: {
          JS: false,
          HTML: false,
          CSS: false,
          Name: true,
        },
        ref: null as null | HTMLInputElement,
      },
    },
    left: { mode: "tree" as "tree" | "history" },
    popup: {
      site: null as null | ((id_site: string) => any),
      site_form: null as null | {
        id: string;
        group_id: string;
        name?: string;
        domain?: string;
        responsive?: string;
      },
    },
    layout: {
      left: 250,
    },
  },
  sync: null as undefined | null | ReturnType<typeof createClient>,
};

export type PG = typeof EDGlobal & { render: () => void };
