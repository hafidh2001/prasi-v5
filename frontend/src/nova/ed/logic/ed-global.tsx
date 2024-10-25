import { NodeModel, TreeMethods } from "@minoru/react-dnd-treeview";
import { RPFlow } from "popup/flow/runtime/types";
import { createClient } from "utils/sync/client";
import { PageTree } from "../crdt/load-page-tree";
import { CompPickerNode } from "../popup/comp/comp-picker/render-picker-node";
import { EComp, EPage, ESite, PropFieldKind } from "./types";
import { ViRef } from "vi/lib/store";
import { defineScriptEdit } from "popup/script/parts/do-edit";

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
    tree: null as unknown as PageTree,
  },
  viref: {} as ViRef,
  comp: {
    pending: new Set<string>(),
    loaded: {} as Record<string, EComp>,
  },
  script: {
    ignore_changes: false,
    snippet_pasted: false,
    do_edit: (() => {}) as unknown as ReturnType<typeof defineScriptEdit>,
    flow: {
      current: null as null | RPFlow,
      should_relayout: false,
    },
    monaco_selection: null as any,
  },
  nav: {
    navigating: false,
    cursor: 0,
    history: [] as { comp_id?: string; item_id: string; ui?: any }[],
  },
  ui: {
    panel: {
      left: localStorage.getItem("prasi-panel-left") !== "n",
      right: localStorage.getItem("prasi-panel-right") !== "n",
    },
    editor: {
      render() {},
    },
    zoom: localStorage.zoom || "100%",
    comp: {
      editable: true,
      creating_id: "",
      loading_id: "",
      last_edit_ids: [] as string[],
    },
    tree: {
      rename_id: "",
      open_all: false,
      ref: null as null | TreeMethods,
      prevent_indent: false,
      prevent_tooltip: false,
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
    right: {
      tab: (localStorage.getItem("prasi-panel-right-tab") || "style") as
        | "style"
        | "vars"
        | "events",
    },
    popup: {
      events: {
        open: "" as "" | "content" | "loop",
      },
      vars: {
        get id() {
          return localStorage.getItem("prasi-panel-var-name") || "";
        },
        set id(value) {
          localStorage.setItem("prasi-panel-var-name", value);
        },
      },
      site: null as null | ((id_site: string) => any),
      site_form: null as null | {
        id: string;
        group_id: string;
        name?: string;
        domain?: string;
        responsive?: string;
      },
      script: {
        get open() {
          const lvar = localStorage.getItem("prasi-popup-script-open");
          return lvar === "true";
        },
        set open(value) {
          localStorage.setItem(
            "prasi-popup-script-open",
            JSON.stringify(value)
          );
        },
        paned: localStorage.getItem("prasi-popup-script-mode") === "paned",
        mode: "js" as "js" | "css" | "html",
        last_mode: "js" as "js" | "css" | "html",
        type: "item" as "item" | "prop-master" | "prop-instance" | "comp-types",
        prop_kind: "" as PropFieldKind,
        prop_name: "",
        on_close: () => {},
        typings: { status: "ok" as "ok" | "loading" | "error", err_msg: "" },
        wb_render: () => {},
        ref: null as any,
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
