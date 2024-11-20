import hash_sum from "hash-sum";
import { PG } from "logic/ed-global";
import { EComp } from "logic/types";
import { monacoCreateModel } from "popup/script/code/js/create-model";
import {
  generateRegion,
  JSX_PASS,
  migrateCode,
  removeRegion,
} from "popup/script/code/js/migrate-code";
import { parseItemCode } from "popup/script/code/js/parse-item-code";
import { SingleExportVar } from "popup/script/code/js/parse-item-types";
import { waitUntil } from "prasi-utils";
import { deepClone } from "utils/react/use-global";
import { jscript } from "utils/script/jscript";
import { ViRef } from "vi/lib/store";
import { FlattenedNodes } from "./flatten-tree";
import { decorateEComp } from "./load-child-comp";
import { rapidhash_fast as hash } from "./rapidhash";
import { TreeVarItems } from "./var-items";

const source_sym = Symbol("source");

export const loadScriptModels = async (arg: {
  nodes: FlattenedNodes;
  p: {
    comp: { loaded: Record<string, EComp>; pending: Set<string> };
    viref: ViRef;
  };
  var_items: TreeVarItems;
  script_models: Record<string, ScriptModel>;
  resume_pending?: Set<string>;
  comp_id?: string;
}) => {
  const { nodes, p, script_models, var_items, comp_id } = arg;

  if (!jscript.loaded) {
    await waitUntil(() => jscript.loaded);
  }

  const jsx_pass = {} as JSX_PASS;
  const model_prop_names = {} as Record<string, string[]>;
  if (comp_id && nodes.array[0].item.component?.id === comp_id) {
    const props = nodes.array[0].item.component?.props;
    for (const [k, v] of Object.entries(props)) {
      if (v.meta?.type === "content-element") jsx_pass[k] = {};
    }
  }

  const pending_items = new Set<string>();

  for (const node of nodes.array) {
    if (arg.resume_pending && !arg.resume_pending.has(node.item.id)) {
      continue;
    }
    const item = node.item;
    if (node.parent?.id && pending_items.has(node.parent?.id)) {
      pending_items.add(node.item.id);
      continue;
    }

    if (item.component) {
      const item_comp_id = item.component?.id;
      let comp_def = p.comp.loaded[item_comp_id];

      if (!comp_def && item_comp_id === comp_id) {
        p.comp.loaded[item_comp_id] = decorateEComp(p as PG, {
          content_tree: item,
          id: item.id,
          id_component_group: "",
        });
        comp_def = p.comp.loaded[item_comp_id];
      }

      if (comp_def) {
        const master_props = comp_def?.content_tree?.component?.props || {};
        const props = item.component?.props || {};
        if (!item.component?.props) {
          item.component.props = props;
        }

        for (const [name, master_prop] of Object.entries(master_props)) {
          let prop = props[name];
          if (name.endsWith("__")) continue;
          const model_id = `${item.id}~${name}`;

          if (!prop && master_prop.meta?.type !== "content-element") {
            prop = {
              value: master_prop.value,
              valueBuilt: master_prop.valueBuilt,
            };
          }

          let prop_value = prop.value || "";
          if (master_prop.meta?.type === "content-element") {
            prop_value = "null as ReactElement";
          }

          const source_hash = hash(prop_value).toString();
          if (script_models[model_id]?.source_hash !== source_hash) {
            script_models[model_id] = newScriptModel({
              comp_def,
              model_id,
              path_ids: node.path_ids,
              prop_name: name,
              path_names: node.path_names,
              title: `${item.name}.${name}`,
              source_hash,
              value: prop_value,
            });
          }
          model_prop_names[item.id] ??= [
            ...(model_prop_names[item.id] || []),
            name,
          ];

          script_models[model_id].title = `${item.name}.${name}`;
          if (master_prop.meta?.type === "content-element") {
            if (!prop && master_prop.content) {
              prop = { content: deepClone(master_prop.content) };
              props[name] = prop;
            }
          }
        }
      } else {
        pending_items.add(node.item.id);
      }
    }

    if (item.vars) {
      const vars = Object.entries(item.vars);
      if (vars.length > 0) {
        for (const [k, v] of vars) {
          var_items[k] = {
            item_id: item.id,
            get item() {
              return item;
            },
            get var() {
              return v;
            },
          };
        }
      }
    }

    const value = item.adv?.js || "";
    const source_hash = hash(value).toString();
    if (script_models[item.id]?.source_hash !== source_hash) {
      let jsx_pass = undefined as any;
      if (node.parent?.component?.prop_name) {
        const comp = p.comp.loaded[node.parent.component.comp_id];
        const name = node.parent?.component?.prop_name;
        const prop = comp.content_tree.component?.props[name];
        if (prop) {
          jsx_pass = prop.jsxPass;
        }
      }
      script_models[item.id] = newScriptModel({
        model_id: item.id,
        path_ids: node.path_ids,
        path_names: node.path_names,
        title: `${item.name}`,
        source_hash,
        value,
        jsx_pass,
      });
    }
    script_models[item.id].title = item.name;
  }

  const has_jsx_props = Object.keys(jsx_pass).length > 0;
  for (const [k, v] of Object.entries(script_models)) {
    if (v.source && !v.ready) {
      parseItemCode(
        v,
        !has_jsx_props
          ? {}
          : {
              Identifier(node: any) {
                const name = node.name;
                const prop = jsx_pass[name];
                if (prop) {
                  if (!prop[v.id]) {
                    prop[v.id] = {};
                  }

                  prop[v.id];
                }
              },
            }
      );
      if (v.local && v.local.name) {
        v.exports[v.local.name] = {
          name: v.local.name,
          value: v.local.value,
          render_mode: v.local.auto_render ? "auto" : "manual",
          type: "local",
        };
      }
    }
  }

  for (const [k, model] of Object.entries(script_models)) {
    if (model_prop_names[model.id]) {
      model.prop_names = model_prop_names[model.id];
    }

    if (model.source && !model.ready) {
      try {
        if (!model.already_migrated) {
          const migrated = migrateCode(model, script_models, comp_id);
          model.source = await jscript.prettier.format?.(migrated);
        } else {
          const code = model.source;
          const lines = code.split("\n");
          const region_end = lines.findIndex((line) =>
            line.startsWith("// #endregion")
          );
          const main_code = lines.slice(region_end + 1).join("\n");
          const region_code = generateRegion(model, script_models, { comp_id });

          model.source = await jscript.prettier.format?.(`\
${region_code}
${main_code}`);
        }
      } catch (e) {
        console.error(
          `[ERROR] When Formatting Code\n${model.title} ~> ${model.id}\n\n`,
          e
        );
      }
    }
  }

  const jsx_exports = {} as Record<
    string,
    { hash: string; exports: Record<string, SingleExportVar> }
  >;
  const jsx_exports_changed = {} as Record<
    string,
    { hash: string; exports: Record<string, SingleExportVar> }
  >;
  for (const [name, prop] of Object.entries(jsx_pass)) {
    for (const [from_id, vars] of Object.entries(prop)) {
      const from = script_models[from_id];
      for (const item_id of from.path_ids) {
        const m = script_models[item_id];
        for (const [k, v] of Object.entries(m.exports)) {
          if (!jsx_exports[name]) {
            jsx_exports[name] = { hash: "", exports: {} };
          }
          jsx_exports[name].exports[k] = v;
        }
      }
    }
    if (comp_id) {
      const comp = p.comp.loaded[comp_id];
      const comp_prop = comp.content_tree.component?.props[name];
      if (comp_prop && jsx_exports[name]) {
        const jsx_hash = hash_sum(jsx_exports[name].exports);
        if (comp_prop.jsxPass?.hash !== jsx_hash) {
          jsx_exports[name].hash = jsx_hash;
          jsx_exports_changed[name] = jsx_exports[name];
        }
      }
    }
  }

  return { pending_items, jsx_exports_changed };
};

export const newScriptModel = ({
  model_id,
  comp_def,
  value,
  title,
  path_names,
  prop_name,
  source_hash,
  path_ids,
  jsx_pass,
}: {
  model_id: string;
  comp_def?: EComp;
  value: string;
  title: string;
  path_names: string[];
  source_hash: string;
  prop_name?: string;
  path_ids: string[];
  jsx_pass?: ScriptModel["jsx_pass"];
}): ScriptModel => {
  let _value = value;
  let already_migrated = false;
  if (value.startsWith("// #region")) {
    already_migrated = true;
  }

  return {
    id: model_id,
    comp_def,
    get source() {
      return this[source_sym];
    },
    set source(value: string) {
      this[source_sym] = value;
      this.source_hash = hash(value).toString();
      this.ready = false;
    },
    [source_sym]: _value,
    title,
    jsx_pass,
    path_names: path_names,
    prop_name,
    path_ids,
    name: `file:///${model_id}.tsx`,
    local: { name: "", value: "", auto_render: false },
    loop: { name: "", list: "" },
    extracted_content: "",
    source_hash,
    ready: false,
    exports: {},
    already_migrated,
  };
};

export type ScriptModel = {
  source: string;
  source_hash: string;
  name: string;
  id: string;
  path_names: string[];
  jsx_pass?: { hash: string; exports: Record<string, SingleExportVar> };
  prop_name?: string;
  prop_names?: string[];
  prop_value?: string;
  path_ids: string[];
  comp_def?: EComp;
  title: string;
  local: { name: string; value: string; auto_render: boolean };
  loop: { name: string; list: string };
  extracted_content: string;
  model?: ReturnType<typeof monacoCreateModel> & { _ignoreChanges?: any };
  [source_sym]: string;
  ready: boolean;
  exports: Record<string, SingleExportVar>;
  already_migrated: boolean;
};
