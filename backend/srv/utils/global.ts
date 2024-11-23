import type { PrismaClient } from "prasi-db";
import type { staticFile } from "./static";
import type { Subprocess } from "bun";

type SITE_ID = string;
export type PrasiSite = {
  id: SITE_ID;
  status: "init" | "loading" | "ready";
  config: {
    disable_lib?: boolean;
    api_url?: string;
  };
  build: {
    process: null | Subprocess;
  };
  asset?: Awaited<ReturnType<typeof staticFile>>;
};
export interface PrasiGlobal {
  reloadCount: number;
  mode: "prod" | "dev";
  _db: PrismaClient;
  site: {
    loaded: Record<SITE_ID, PrasiSite>;
    loading: Record<SITE_ID, { status: string }>;
  };
}

declare global {
  var g: PrasiGlobal;
  var _db: PrismaClient;
}
