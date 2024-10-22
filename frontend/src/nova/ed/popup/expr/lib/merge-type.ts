import { EDeepType } from "./types";

export const mergeType = (...types: EDeepType[]): EDeepType[] => {
  if (types.length <= 1) return types;

  const seen = new Set();
  const merged = [];
  for (const type of types) {
    let simplified = "";
    if (["object", "array"].includes(type.simple)) {
      simplified = JSON.stringify(type.type);
    } else {
      simplified = type.simple;
    }

    if (seen.has(simplified)) {
      continue;
    }
    seen.add(simplified);
    merged.push(type);
  }

  return merged;
};
