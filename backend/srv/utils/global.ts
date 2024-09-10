import type { PrismaClient } from "prasi-db";
export interface PrasiGlobal {
  reloadCount: number;
  mode: "prod" | "dev";
  db: PrismaClient;
}

declare global {
  var g: PrasiGlobal;
  var db: PrismaClient;
}
