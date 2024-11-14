import type { Subprocess } from "bun";
import type { PrismaClient } from "prasi-db";
import type { FSWatcher } from "fs";
import type { staticFile } from "./static";

type SITE_ID = string;
export type PrasiSite = {
  id: SITE_ID;
  status: "init" | "loading" | "ready";
  building: boolean;
  rsbuild?: Subprocess;
  config: {
    disable_lib?: boolean;
    api_url?: string;
  };
  promises: ((site: any) => void)[];
  watcher: Record<string, FSWatcher>;
  change_timeout: any;
  asset?: Awaited<ReturnType<typeof staticFile>>;
};
export interface PrasiGlobal {
  reloadCount: number;
  mode: "prod" | "dev";
  _db: PrismaClient;
  site: Record<SITE_ID, PrasiSite>;
}

declare global {
  var g: PrasiGlobal;
  var _db: PrismaClient;
}
