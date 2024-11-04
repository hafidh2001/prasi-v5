import { EComp } from "logic/types";
import { monacoCreateModel } from "popup/script/code/js/create-model";
import { migrateCode } from "popup/script/code/js/migrate-code";
import { parseItemCode } from "popup/script/code/js/parse-item-code";
import { SingleExportVar } from "popup/script/code/js/parse-item-types";
import { waitUntil } from "prasi-utils";
import { jscript } from "utils/script/jscript";
import { IItem } from "utils/types/item";
import { loopItem } from "./loop-item";
import { rapidhash_fast as hash } from "./rapidhash";
import { TreeVarItems } from "./var-items";
import { active } from "logic/active";

const source_sym = Symbol("source");

export type ScriptModel = {
  source: string;
  source_hash: string;
  name: string;
  id: string;
  path_names: string[];
  prop_name?: string;
  path_ids: string[];
  title: string;
  local: { name: string; value: string; auto_render: boolean };
  extracted_content: string;
  model?: ReturnType<typeof monacoCreateModel> & { _ignoreChanges?: any };
  [source_sym]: string;
  ready: boolean;
  exports: Record<string, SingleExportVar>;
};

export const loadScriptModels = async (
  p: { comp: { loaded: Record<string, EComp>; pending: Set<string> } },
  items: IItem[],
  result: Record<string, ScriptModel>,
  var_items: TreeVarItems
) => {
  if (!jscript.loaded) {
    await waitUntil(() => jscript.loaded);
  }

  await loopItem(
    items,
    { active_comp_id: active.comp_id },
    async ({ item, path_name, path_id }) => {
      if (item.component?.id) {
        const comp_id = item.component.id;
        for (const [name, prop] of Object.entries(item.component.props)) {
          const file = `${item.id}~${name}`;
          if (!prop) continue;
          let prop_value = prop.value || "";
          const source_hash = hash(prop_value).toString();

          if (result[file]?.source_hash !== source_hash) {
            let comp_def = p.comp.loaded[comp_id];

            result[file] = {
              id: item.id,
              get source() {
                return this[source_sym];
              },
              set source(value: string) {
                this[source_sym] = value;
                this.source_hash = hash(value).toString();
                this.ready = false;
              },
              [source_sym]: prop_value,
              title: `${item.name}.${name}`,
              path_names: path_name,
              prop_name: name,
              path_ids: path_id,
              name: `file:///${file}.tsx`,
              local: { name: "", value: "", auto_render: false },
              extracted_content: "",
              source_hash,
              ready: false,
              exports: {},
            };
          }
          result[file].title = `${item.name}.${name}`;
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
      if (result[item.id]?.source_hash !== source_hash) {
        result[item.id] = {
          id: item.id,
          [source_sym]: value,
          get source() {
            return this[source_sym];
          },
          set source(value: string) {
            this[source_sym] = value;
            this.source_hash = hash(value).toString();
            this.ready = false;
          },
          name: `file:///${item.id}.tsx`,
          path_names: path_name,
          path_ids: path_id,
          title: item.name,
          local: { name: "", value: "", auto_render: false },
          extracted_content: "",
          source_hash,
          ready: false,
          exports: {},
        };
      }
      result[item.id].title = item.name;
    }
  );

  for (const [k, v] of Object.entries(result)) {
    if (v.source && !v.ready) {
      parseItemCode(v);
      if (v.local) {
        v.exports[v.local.name] = {
          name: v.local.name,
          value: v.local.value,
          type: "local",
        };
      }
    }
  }

  for (const [k, v] of Object.entries(result)) {
    if (v.source && !v.ready) {
      try {
        v.source = await jscript.prettier.format?.(migrateCode(v, result));
      } catch (e) {
        console.error(
          `[ERROR] When Formatting Code\n${v.title} ~> ${v.id}\n\n`,
          e
        );
      }
      v.ready = true;
    }
  }

  return result;
};
