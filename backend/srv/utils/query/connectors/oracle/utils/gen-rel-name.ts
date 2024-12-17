import type { NAME } from "utils/query/types";

export const generateRelationName = (
  table_name: NAME,
  fk_from_col: NAME,
  fk_target_col: NAME
) => {
  const mix_col_name = fk_from_col.replace(fk_target_col, "");

  return `${table_name}${mix_col_name}`;
};
