import type {
  PQuerySelectCol,
  PQuerySelectRel,
} from "prasi-frontend/src/nova/ed/mode/query/types";
import type { QInspectResult } from "utils/query/types";

export const getColumns = (
  i: QInspectResult,
  table: string,
  select: (PQuerySelectCol | PQuerySelectRel)[]
): string[] => {
  const result = [] as string[];

  for (const c of select) {
    if (c.type === "column") {
      const col = colName(i, table, c.col_name);
      if (col) result.push(col);
    } else {
      if (c.select) {
        const rel = i.tables[table]?.relations[c.rel_name];
        if (rel) {
          if (rel.type === "one-to-many") {
            const db_table = rel.from.table;
            const sub_result = getColumns(i, db_table, c.select);
            for (const s of sub_result) {
              result.push(s);
            }
          } else if (rel.type === "many-to-one") {
            const db_table = rel.to.table;
            const sub_result = getColumns(i, db_table, c.select);
            for (const s of sub_result) {
              result.push(s);
            }
          }
        }
      }
    }
  }

  return result;
};

const colName = (i: QInspectResult, table: string, col: string) => {
  if (!i.tables[table]?.columns[col]) {
    return "";
  }
  const db_table = i.tables[table].db_name;
  const db_col = i.tables[table]?.columns[col].db_name;

  return `${db_table}.${db_col}`;
};
