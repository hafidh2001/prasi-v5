import { EComp } from "logic/types";
import { FlattenedNodes } from "./flatten-tree";
import { ViRef } from "vi/lib/store";
import { jscript } from "utils/script/jscript";
import { waitUntil } from "prasi-utils";
import { rapidhash_fast as hash } from "./rapidhash";
import { monacoCreateModel } from "popup/script/code/js/create-model";
import { SingleExportVar } from "popup/script/code/js/parse-item-types";
import { deepClone } from "utils/react/use-global";
import { TreeVarItems } from "./var-items";
import { parseItemCode } from "popup/script/code/js/parse-item-code";
import {
  generateRegion,
  migrateCode,
  removeRegion,
} from "popup/script/code/js/migrate-code";
import { FNCompDef } from "utils/types/meta-fn";
import { active } from "logic/active";

const source_sym = Symbol("source");

export const loadScriptModels = async (arg: {
  nodes: FlattenedNodes;
  p: {
    comp: { loaded: Record<string, EComp>; pending: Set<string> };
    viref: ViRef;
  };
  var_items: TreeVarItems;
  script_models: Record<string, ScriptModel>;
  comp_id?: string;
}) => {
  const { nodes, p, script_models, var_items, comp_id } = arg;

  if (!jscript.loaded) {
    await waitUntil(() => jscript.loaded);
  }
  const jsx_props = {} as Record<string, FNCompDef>;
  if (comp_id && nodes.array[0].item.component?.id === comp_id) {
    const props = nodes.array[0].item.component?.props;
    for (const [k, v] of Object.entries(props)) {
      if (v.meta?.type === "content-element") jsx_props[k] = v;
    }
  }

  for (const node of nodes.array) {
    const item = node.item;
    if (item.component) {
      const item_comp_id = item.component?.id;
      const comp_def = p.comp.loaded[item_comp_id];
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

        script_models[model_id].title = `${item.name}.${name}`;
        if (master_prop.meta?.type === "content-element") {
          if (!prop && master_prop.content) {
            prop = { content: deepClone(master_prop.content) };
            props[name] = prop;
          }
        }
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
      script_models[item.id] = newScriptModel({
        model_id: item.id,
        path_ids: node.path_ids,
        path_names: node.path_names,
        title: `${item.name}`,
        source_hash,
        value,
      });
    }
    script_models[item.id].title = item.name;
  }

  const has_jsx_props = Object.keys(jsx_props).length > 0;
  for (const [k, v] of Object.entries(script_models)) {
    if (v.source && !v.ready) {
      parseItemCode(
        v,
        !has_jsx_props
          ? {}
          : {
              Identifier(node: any) {
                const name = node.name;
                const prop = jsx_props[name];
                if (prop) {
                  // console.log(k, v.source, name);
                }
              },
            }
      );
      if (v.local && v.local.name) {
        v.exports[v.local.name] = {
          name: v.local.name,
          value: v.local.value,
          type: "local",
        };
      }
    }
  }

  for (const [k, model] of Object.entries(script_models)) {
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
          const region_code = generateRegion(model, script_models);

          model.source = `\
${region_code}

${main_code}`;
        }
      } catch (e) {
        console.error(
          `[ERROR] When Formatting Code\n${model.title} ~> ${model.id}\n\n`,
          e
        );
      }
      model.ready = true;
    }
  }

  return script_models;
};

const newScriptModel = ({
  model_id,
  comp_def,
  value,
  title,
  path_names,
  prop_name,
  source_hash,
  path_ids,
}: {
  model_id: string;
  comp_def?: EComp;
  value: string;
  title: string;
  path_names: string[];
  source_hash: string;
  prop_name?: string;
  path_ids: string[];
}): ScriptModel => {
  let _value = value;
  let already_migrated = false;
  if (value.startsWith("// #region")) {
    _value = removeRegion(value);
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
  prop_name?: string;
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
