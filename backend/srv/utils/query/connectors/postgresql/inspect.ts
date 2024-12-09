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

  return result;
};
