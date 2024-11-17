import { getActiveNode } from "crdt/node/get-node-by-id";
import trim from "lodash.trim";
import { PG } from "logic/ed-global";
import { removeRegion } from "popup/script/code/js/migrate-code";
import { FNCompDef } from "utils/types/meta-fn";

export const extractValue = (p: PG, name: string, prop: FNCompDef) => {
  let original_value = "";
  let has_code = false;
  if (!prop) {
    const comp_id = getActiveNode(p)?.item?.component?.id;
    if (comp_id) {
      const comp = p.comp.loaded[comp_id];
      const cprop = comp?.content_tree.component?.props[name];
      prop = JSON.parse(JSON.stringify(cprop));
    } else {
      return;
    }
  }
  original_value = prop.value;
  let value = "";
  if (typeof prop.value === "string") {
    value = prop.value;
    if (!value) {
      has_code = false;
      value = "";
      return { original_value, value, has_code };
    }
    const extracted_str = extractString(name, value?.trim());
    if (extracted_str) {
      value = trim(extracted_str, `\`"'`);
      has_code = false;
    } else {
      has_code = true;
    }

    if (value.trim().startsWith(`export const ${name} =`)) {
      value = trim(
        value.trim().substring(`export const ${name} =`.length).trim(),
        ";"
      );
    }
  } else {
    console.log(prop.value);
  }

  return { original_value, value, has_code };
};

export const extractString = (name: string, str: string): string => {
  if (str.charAt(0) === "(" && str.charAt(str.length - 1) === ")") {
    let substr = str.slice(1, -1);
    if (['"', "'", "`"].includes(substr.charAt(0))) {
      if (substr.charAt(substr.length - 1) === substr.charAt(0)) {
        return substr;
      }
    }
  } else if (['"', "'", "`"].includes(str.charAt(0))) {
    if (str.charAt(str.length - 1) === str.charAt(0)) {
      return str;
    }
  }

  let no_region = removeRegion(str);

  if (no_region.startsWith(`export const ${name} =`)) {
    if (no_region.endsWith(";")) {
      no_region = no_region.slice(0, -1);
    }
    return extractString(
      name,
      no_region.slice(`export const ${name} =`.length).trim()
    );
  }

  return no_region || "";
};
