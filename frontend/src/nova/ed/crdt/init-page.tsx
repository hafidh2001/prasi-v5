import { PG } from "logic/ed-global";
import { EPageContentTree } from "logic/types";
import { updateActiveCodeFromServer } from "popup/script/code/js/update-active-code";
import { createId } from "utils/script/create-id";

export const initPage = (p: PG) => ({
  comp_ids: new Set<string>(),
  uncleaned_comp_ids: new Set<string>(),
  prepare(content_tree: EPageContentTree) {
    const comp_ids = this.comp_ids;
    const uncleaned_comp_ids = this.uncleaned_comp_ids;

    const pending_update_prop = {} as Record<string, Record<string, any>>;
    const push_update_prop = (id: string, key: string, value: any) => {
      if (!pending_update_prop[id]) {
        pending_update_prop[id] = {};
      }
      pending_update_prop[id][key] = value;
    };

    for (const [id, item] of Object.entries(p.page.pending_instances)) {
      if (item.component) {
        const instance_props = item.component.props;
        const comp = p.comp.loaded[item.component.id];
        const master_props = comp?.content_tree.component?.props;
        if (comp && master_props) {
          for (const [k, master] of Object.entries(master_props)) {
            const prop = instance_props[k];
            const type = master.meta?.type || "text";

            if (
              type !== "content-element" &&
              (!prop || Object.keys(prop || {}).length > 2)
            ) {
              push_update_prop(id, k, {
                value: prop?.value || master?.value,
                valueBuilt: prop?.valueBuilt || master?.valueBuilt,
              });
            }

            if (
              type === "content-element" &&
              (!prop || Object.keys(prop || {}).length > 1 || !prop?.content)
            ) {
              push_update_prop(id, k, {
                content: prop?.content ||
                  master.content || {
                    id: createId(),
                    name: k,
                    type: "item",
                    childs: [],
                  },
              });
            }
          }
        }
      }
    }

    const should_update_usage =
      JSON.stringify([...comp_ids]) !==
      JSON.stringify(content_tree.component_ids);


    if (
      should_update_usage ||
      Object.keys(pending_update_prop).length > 0 ||
      uncleaned_comp_ids.size > 0
    ) {
      p.page.tree.update("Page Prep", ({ tree, findNode }) => {
        if (should_update_usage) tree.component_ids = [...comp_ids];
        for (const [k, v] of Object.entries(pending_update_prop)) {
          if (pending_update_prop[k]) {
            const node = findNode(k);
            const props = node?.item.component?.props;
            if (node && props) {
              for (const [name, prop] of Object.entries(v)) {
                props[name] = prop;
              }
            }
          }
        }
        if (uncleaned_comp_ids.size > 0) {
          for (const id of uncleaned_comp_ids) {
            const node = findNode(id);
            if (node && node.item.component) {
              delete node.item.component.instances;
            }
          }
        }
      });
    }

    p.page.cur.content_tree = content_tree;
    if (!p.mode) p.mode = "desktop";
    if (["mobile", "desktop"].includes(content_tree.responsive)) {
      p.mode = content_tree.responsive;
    }

    if (p.ui.popup.script.open) {
      updateActiveCodeFromServer(p);
    }
  },
});
