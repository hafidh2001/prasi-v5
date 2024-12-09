import type {
  NAME,
  QInspectColumn,
  QInspectFK,
  QInspectRelation,
  QInspectResult,
  QInspectTable,
} from "utils/query/types";
import type { PgConfig } from "./utils/config";

export const inspect = async (c: PgConfig): Promise<QInspectResult> => {
  const result = { tables: {} };

  if (!c.pool) return result;

  const tables = await c.pool.query(`SELECT table_name
FROM information_schema.tables
WHERE table_schema = '${c.schema}';`);

  console.log(tables.rows.map((e) => e.table_name));

  return result;
};
