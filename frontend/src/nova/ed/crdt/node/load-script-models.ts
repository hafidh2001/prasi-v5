import { migrateCode } from "popup/script/code/js/migrate-code";
import { parseItemCode } from "popup/script/code/js/parse-item-code";
import { waitUntil } from "prasi-utils";
import { jscript } from "utils/script/jscript";
import { IItem } from "utils/types/item";
import { loopItem } from "./loop-item";

export type ScriptModel = {
  source: string;
  name: string;
  id: string;
  path_names: string[];
  path_ids: string[];
  title: string;
  local: { name: string; value: string };
  extracted_content: string;
  import_region: { start: 0; end: 0 };
};

export const loadScriptModels = async (items: IItem[]) => {
  const result = {} as Record<string, ScriptModel>;

  if (!jscript.loaded) {
    await waitUntil(() => jscript.loaded);
  }

  loopItem(items, async ({ item, path_name, path_id, parent }) => {
    if (item.component?.id) {
      for (const [name, prop] of Object.entries(item.component.props)) {
        if (!(prop.content && prop.meta?.type === "content-element")) {
          const file = `${item.id}~${name}`;
          result[file] = {
            id: item.id,
            source: prop.value,
            title: `${item.name}.${name}`,
            path_names: path_name,
            path_ids: path_id,
            name: `file:///${file}.tsx`,
            local: { name: "", value: "" },
            extracted_content: "",
            import_region: { start: 0, end: 0 },
          };
        }
      }
    } else {
      result[item.id] = {
        id: item.id,
        source: item.adv?.js || "",
        name: `file:///${item.id}.tsx`,
        path_names: path_name,
        path_ids: path_id,
        title: `${item.name}`,
        local: { name: "", value: "" },
        extracted_content: "",
        import_region: { start: 0, end: 0 },
      };
    }
  });

  for (const [k, v] of Object.entries(result)) {
    if (v.source) {
      parseItemCode(v);
    }
  }

  for (const [k, v] of Object.entries(result)) {
    if (v.source) {
      v.source = await jscript.prettier.format?.(migrateCode(v, result));
    }
  }

  return result;
};
