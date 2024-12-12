import type { NAME, QInspectRelation } from "utils/query/types";

export const relationSuffix = (
  table_name: NAME,
  relations: Record<NAME, QInspectRelation>
) => {
  if (!relations[table_name]) {
    return table_name;
  }

  let suffix = 2;
  let uniqueKey = `${table_name}${suffix}`;

  // Increment suffix until the key is unique
  while (relations[uniqueKey]) {
    suffix++;
    uniqueKey = `${table_name}${suffix}`;
  }

  return uniqueKey;
};
