import type {
  PQuerySelect,
  PQuerySelectCol,
  PQuerySelectRel,
  PQuerySelectWhere,
} from "prasi-frontend/src/nova/ed/mode/query/types";
import type { NAME, QInspectResult } from "utils/query/types";

export const getWheres = (
  i: QInspectResult,
  table: NAME,
  select: (PQuerySelectCol | PQuerySelectRel)[],
  where: PQuerySelect["where"]
): string[] => {
  const result = [] as string[];

  for (const w of where) {
    const where_name = whereName(table, w);
    result.push(where_name);
  }

  for (const c of select) {
    if (c.type === "relation") {
      // Recursive call to process nested relations
      if (c.select) {
        result.push(...getWheres(i, c.rel_name, c.select, c.where || []));
      }
    }
  }

  return result;
};

const whereName = (table: NAME, where: PQuerySelectWhere) => {
  const db_table = table.toUpperCase();
  const w_col = where.column.toUpperCase();
  const w_opt = where.operator;
  const w_val = where.value;

  return `${db_table}.${w_col} ${w_opt} '${w_val}'`;
};
