import type { Expression } from "@oxc-parser/wasm";
import get from "lodash.get";
import { ReactElement } from "react";
import { cutCode, jscript } from "utils/script/jscript";

export type PLObject = { type: "object"; value: Record<string, PLValue> };
export type PLString = { type: "string"; value: string };
export type PLCode = { type: "code"; value: string };
export type PLValue = PLString | PLCode | PLObject;

export type LSString = {
  type: "string";
  placeholder?: string;
  deletable?: boolean;
  disabled?: boolean;
  label?: string;
  options?: ({ label: string; value: string } | string)[];
};
export type LSObject = {
  type: "object";
  object: Record<string, ListStructure>;
};
export type ListStructure = LSString | LSObject;
export type ListLayout = Record<
  string,
  (arg: {
    structure: ListStructure;
    value: any;
    update: (key: string, value: any) => void;
  }) => ReactElement
>;
export const getPropStructureByPath = (
  structure: ListStructure,
  path: (string | number)[]
): ListStructure | undefined => {
  let current: ListStructure | undefined = structure;

  for (const key of path) {
    if (!current) {
      return undefined; // Return undefined if the structure is invalid
    }

    if (typeof current === "object" && current.type === "object") {
      if (typeof key === "string" && key in current.object) {
        current = current.object[key]; // Navigate to the next object in the path
      } else {
        return undefined; // Key does not exist in the current object
      }
    } else {
      return undefined; // Current is not an object or is an LSString
    }
  }

  return current; // Return the found structure or undefined if not found
};

export const parsePLValue = (source: string): PLValue[] => {
  const parsed = jscript.parse?.(source, {
    sourceFilename: "script.tsx",
    sourceType: "script",
  });

  const root = get(parsed, "program.body.0.expression");

  const items = [];
  if (root?.type === "ArrayExpression") {
    for (const item of root.elements) {
      if (item && item?.type !== "SpreadElement") {
        const single = parseSingle(source, item);
        items.push(single);
      }
    }
  }

  return items;
};

const space = "  ";
export const plStringifySingle = (value: PLValue, depth?: number): string => {
  const indent = space.repeat(depth || 1);
  if (value.type === "string") {
    return `"${value.value}"`;
  } else if (value.type === "code") {
    return value.value;
  } else if (value.type === "object") {
    const items = [];
    for (const key in value.value) {
      const item = value.value[key];
      items.push(`${key}: ${plStringifySingle(item, (depth || 1) + 1)}`);
    }
    const closing = space.repeat((depth || 1) - 1);
    return `{\n${indent}${items.join(`,\n${indent}`)}\n${closing}}`;
  }
  return "";
};

export const getPropValueByPath = (
  value: PLValue[],
  path: (string | number)[]
): PLValue | null => {
  // Start with the initial value (assumes value is an array)
  let current: PLValue | undefined =
    value.length > 0 ? value[path[0] as number] : undefined;

  path.shift();
  for (const key of path) {
    // Check if 'current' is defined and is a PLObject
    if (
      current &&
      current.type === "object" &&
      typeof current.value === "object" &&
      current.value !== null
    ) {
      // Cast to a Record
      const next = current.value as Record<string, PLValue>;

      // Check if the key exists in the next value
      if (key in next) {
        current = next[key as string]; // Move to the next property
      } else {
        // If the key is not found, return null
        return null;
      }
    } else {
      // If current is not an object, return null
      return null;
    }
  }

  // Return the found value or null if it doesn't exist
  return current ?? null;
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
      if (v.type === "string" && v.deletable === true) continue;
      item.value[k] = createListItem(v);
    }
    return item;
  }
  return { type: "string", value: "" } as PLString;
};
