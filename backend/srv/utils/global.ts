import type { BunSqliteKeyValue } from "bun-sqlite-key-value";
import type { PrismaClient } from "prasi-db";
import type { ESite } from "prasi-frontend/src/nova/ed/logic/types";
import type { spawn } from "./spawn";
import type { parseTypeDef } from "./parser/parse-type-def";
import type { staticFile } from "./files/static";
import type { bunWatchBuild } from "./site/loading-checklist/bun-build";

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
  build_result: {
    vsc_vars: Awaited<ReturnType<typeof parseTypeDef>>;
    log: {
      frontend: string;
      typings: string;
      backend: string;
      tailwind: string;
    };
    is_ready: {
      frontend: boolean;
      typings: boolean;
    };
  };
  prasi: {
    frontend: { index: string; internal: string; typings: string };
    backend: { index: string };
    log: {
      frontend: string;
      backend: string;
      typings: string;
      tailwind: string;
    };
  };
};
export type PrasiSiteLoading = {
  status: string;
  data?: ESite;
  deps_install?: ReturnType<typeof spawn>;
  build: {
    frontend?: Awaited<ReturnType<typeof bunWatchBuild>>;
    backend?: ReturnType<typeof spawn>;
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
  static_cache: { gz: BunSqliteKeyValue; zstd: BunSqliteKeyValue };
}

declare global {
  var g: PrasiGlobal;
  var _db: PrismaClient;
}
