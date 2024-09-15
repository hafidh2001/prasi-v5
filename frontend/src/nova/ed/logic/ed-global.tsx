import { NodeModel, TreeMethods } from "@minoru/react-dnd-treeview";
import { loadPageTree } from "../crdt/load-page-tree";
import { EBaseComp, EComp, EPage, ESite, PropFieldKind } from "./types";
import { createClient } from "utils/sync/client";
import { CompPickerNode } from "../tree/parts/popup/comp-picker/render-picker-node";

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
    loaded: {} as Record<string, EComp>,
  },
  ui: {
    comp: {
      editable: true,
      creating_id: "",
      loading_id: "",
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
      comp_group: {
        mouse_event: null as null | React.MouseEvent<HTMLElement, MouseEvent>,
        on_pick(group_id: string) {},
        on_close() {},
      },
      comp: {
        search: { value: "" },
        on_pick: null as null | ((comp_id: string) => void),
        render: () => {},
        picker_ref: null as null | HTMLDivElement,
        status: "loading" as "loading" | "ready",
        should_import: false,
        data: {
          comps: [] as {
            id: string;
            name: string;
            id_component_group: string | null;
          }[],
          groups: [] as { id: string; name: string }[],
          nodes: [] as NodeModel<CompPickerNode>[],
        },
      },
    },
    layout: {
      left: 250,
    },
  },
  sync: null as undefined | null | ReturnType<typeof createClient>,
};

export type PG = typeof EDGlobal & { render: () => void };
