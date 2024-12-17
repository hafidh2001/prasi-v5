import type {
  PQuerySelectCol,
  PQuerySelectRel,
} from "prasi-frontend/src/nova/ed/mode/query/types";
import type { NAME, QInspectRelation, QInspectResult } from "utils/query/types";

export const getJoins = (
  i: QInspectResult,
  table: NAME,
  select: (PQuerySelectCol | PQuerySelectRel)[]
): string[] => {
  const result = [] as string[];

  for (const c of select) {
    if (c.type === "relation") {
      if (c.select) {
        const rel = i.tables[table]?.relations[c.rel_name];
        if (rel) {
          const join = joinName(rel, c.rel_name);
          if (join) result.push(join);

          // Recursive call to process nested relations
          if (rel.type === "one-to-many") {
            result.push(...getJoins(i, rel.from.table, c.select));
          } else if (rel.type === "many-to-one") {
            result.push(...getJoins(i, rel.to.table, c.select));
          }
        }
      }
    }
  }

  return result;
};

const joinName = (
  rel: QInspectRelation,
  rel_name: PQuerySelectRel["rel_name"]
) => {
  const fk_table = rel.from.table.toUpperCase();
  const fk_col = rel.from.column.toUpperCase();
  const p_table = rel.to.table.toUpperCase();
  const p_col = rel.to.column.toUpperCase();
  const alias = rel_name.toUpperCase();

  if (rel.type === "one-to-many") {
    return `JOIN ${fk_table} ${alias} ON ${p_table}.${p_col} = ${alias}.${fk_col}`;
  } else if (rel.type === "many-to-one") {
    return `JOIN ${p_table} ${alias} ON ${fk_table}.${fk_col} = ${alias}.${p_col}`;
  }
};
