import { TreeMethods } from "@minoru/react-dnd-treeview";
import { createClient } from "../../../utils/sync/client";
import { loadCompTree } from "../crdt/load-comp-tree";
import { loadPageTree } from "../crdt/load-page-tree";
import { EComp, EPage, ESite, PropFieldKind } from "./types";

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
    tree: null as unknown as ReturnType<typeof loadPageTree>,
  },
  comp: {
    pending: new Set<string>(),
    loaded: {} as Record<string, Awaited<ReturnType<typeof loadCompTree>>>,
  },
  ui: {
    comp: {
      editable: true,
    },
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
      script: {
        open: false,
        mode: "js" as "js" | "css" | "html",
        lastMode: "js" as "js" | "css" | "html",
        type: "item" as "item" | "prop-master" | "prop-instance" | "comp-types",
        prop_kind: "" as PropFieldKind,
        prop_name: "",
        on_close: () => {},
        typings: { status: "ok" as "ok" | "loading" | "error", err_msg: "" },
        wb_render: () => {},
      },
    },
    layout: {
      left: 250,
    },
  },
  sync: null as undefined | null | ReturnType<typeof createClient>,
};

export type PG = typeof EDGlobal & { render: () => void };
