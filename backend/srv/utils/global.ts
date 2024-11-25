import type { BunSqliteKeyValue } from "bun-sqlite-key-value";
import type { PrismaClient } from "prasi-db";
import type { ESite } from "prasi-frontend/src/nova/ed/logic/types";
import type { spawn } from "./spawn";
import type { staticFile } from "./static";

type SITE_ID = string;
export type PrasiSite = {
  id: SITE_ID;
  config: {
    disable_lib?: boolean;
    api_url?: string;
  };
  data: ESite;
  build: PrasiSiteLoading["build"];
  asset?: Awaited<ReturnType<typeof staticFile>>;
};
export type PrasiSiteLoading = {
  status: string;
  data?: ESite;
  mode?: "new" | "upgrade" | "run";
  deps_install?: ReturnType<typeof spawn>;
  build: {
    rsbuild?: ReturnType<typeof spawn>;
    typings?: ReturnType<typeof spawn>;
  };
};
export interface PrasiGlobal {
  reloadCount: number;
  mode: "prod" | "dev";
  _db: PrismaClient;
  site: {
    loaded: Record<SITE_ID, PrasiSite>;
    loading: Record<SITE_ID, PrasiSiteLoading>;
  };
  rsbuild: {
    prasi_port: 0;
    site_port: 0;
  };
  static_cache: BunSqliteKeyValue;
}

declare global {
  var g: PrasiGlobal;
  var _db: PrismaClient;
}
