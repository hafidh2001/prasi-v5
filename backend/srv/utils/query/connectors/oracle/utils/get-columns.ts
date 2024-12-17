import type {
  PQuerySelectCol,
  PQuerySelectRel,
} from "prasi-frontend/src/nova/ed/mode/query/types";
import type { NAME, QInspectResult } from "utils/query/types";

export const getColumns = (
  i: QInspectResult,
  table: NAME,
  select: (PQuerySelectCol | PQuerySelectRel)[],
  rel_name?: PQuerySelectRel["rel_name"]
): string[] => {
  const result = [] as string[];

  for (const c of select) {
    if (c.type === "column") {
      const col = colName(i, table, c.col_name, rel_name);
      if (col) result.push(col);
    } else {
      if (c.select) {
        const rel = i.tables[table]?.relations[c.rel_name];
        if (rel) {
          if (rel.type === "one-to-many") {
            const db_table = rel.from.table;
            // call recursive function
            const sub_result = getColumns(i, db_table, c.select, c.rel_name);
            for (const s of sub_result) {
              result.push(s);
            }
          } else if (rel.type === "many-to-one") {
            const db_table = rel.to.table;
            // call recursive function
            const sub_result = getColumns(i, db_table, c.select, c.rel_name);
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

const colName = (
  i: QInspectResult,
  table: NAME,
  col: PQuerySelectCol["col_name"],
  rel_name?: PQuerySelectRel["rel_name"]
) => {
  if (!i.tables[table]?.columns[col]) {
    return "";
  }
  const db_table = i.tables[table].db_name;
  const db_col = i.tables[table]?.columns[col].db_name;
  const alias = rel_name?.toUpperCase();

  return `${alias ?? db_table}.${db_col}`;
};
