import type { PrismaClient as PrasiEditorDB } from "prasi-prisma";
import { DBInspectResult } from "./prasi-db/db-inspect";
const db_cache = {} as Record<string, Record<string, DBInspectResult>>;

export const prasi_db = {
  editor: _db as PrasiEditorDB,
};
