import { DBInspectResult } from "./prasi-db/db-inspect";
import { PrasiDBEditor } from "./prasi-db/db-typings";

const db_cache = {} as Record<string, Record<string, DBInspectResult>>;

export const prasi_db = {
  editor: _db as PrasiDBEditor,
};
