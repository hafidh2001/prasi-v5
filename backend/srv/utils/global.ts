import type { Subprocess } from "bun";
import type { PrismaClient } from "prasi-db";
import type { FSWatcher } from "fs";

type SITE_ID = string;
export interface PrasiGlobal {
  reloadCount: number;
  mode: "prod" | "dev";
  _db: PrismaClient;
  site: Record<
    SITE_ID,
    {
      loading: boolean;
      rsbuild?: Subprocess;
      promises: ((site: any) => void)[];
      watcher: Record<string, FSWatcher>;
      change_timeout: any;
    }
  >;
}

declare global {
  var g: PrasiGlobal;
  var _db: PrismaClient;
}
