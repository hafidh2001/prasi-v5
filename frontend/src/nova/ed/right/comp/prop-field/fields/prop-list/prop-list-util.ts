import { Expression } from "@oxc-parser/wasm";
import get from "lodash.get";
import { cutCode, jscript } from "utils/script/jscript";

export type PLObject = { type: "object"; value: Record<string, PLValue> };
export type PLString = { type: "string"; value: string };
export type PLCode = { type: "code"; value: string };
export type PLValue = PLString | PLCode | PLObject;

export type LSString = {
  type: "string";
  placeholder?: string;
  options?: ({ label: string; value: string } | string)[];
};
export type LSObject = {
  type: "object";
  object: Record<string, ListStructure>;
};
export type ListStructure = LSString | LSObject;

export const parsePLValue = (source: string): PLValue[] => {
  const parsed = jscript.parse?.(source);

  const root = get(parsed, "program.body.0.expression");

  const items = [];
  if (root?.type === "ArrayExpression") {
    for (const item of root.elements) {
      if (item && item?.type !== "SpreadElement")
        items.push(parseSingle(source, item));
    }
  }

  return items;
};

export const plStringify = (value: PLValue): string => {
  if (value.type === "string") {
    return `"${value.value}"`;
  } else if (value.type === "code") {
    return value.value;
  } else if (value.type === "object") {
    const items = [];
    for (const key in value.value) {
      const item = value.value[key];
      items.push(`${key}: ${plStringify(item)}`);
    }
    return `{${items.join(", ")}}`;
  }
  return "";
};

const parseSingle = (source: string, item: Expression) => {
  if (item.type === "ObjectExpression") {
    const result = { type: "object", value: {} } as PLObject;

    for (const prop of item.properties) {
      if (prop.type === "ObjectProperty" && prop.key.type === "Identifier") {
        const single = parseSingle(source, prop.value);
        if (single) {
          const name = prop.key.name;
          result.value[name] = single;
        }
      }
    }
    return result as PLValue;
  } else if (item.type === "StringLiteral") {
    return { type: "string", value: item.value } as PLString;
  }
  return { type: "code", value: cutCode(source, item) } as PLCode;
};

export const createListItem = (structures: ListStructure): PLValue => {
  if (structures.type === "object") {
    const item = { type: "object", value: {} } as PLObject;
    for (const [k, v] of Object.entries(structures.object)) {
      item.value[k] = createListItem(v);
    }
    return item;
  }
  return { type: "string", value: "" } as PLString;
};
