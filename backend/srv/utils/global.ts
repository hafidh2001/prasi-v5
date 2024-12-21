import type { BunSqliteKeyValue } from "bun-sqlite-key-value";
import type { PrismaClient } from "prasi-db";
import type { ESite } from "prasi-frontend/src/nova/ed/logic/types";
import type { spawn } from "./spawn";
import type { parseTypeDef } from "./parser/parse-type-def";
import type { staticFile } from "./files/static";
import type { bunWatchBuild } from "./site/init/bun-build";

type SITE_ID = string;
export type PrasiSite = {
  id: SITE_ID;
  config: {
    disable_lib?: boolean;
    api_url?: string;
  };
  data: ESite;
  build: PrasiSiteLoading["process"];
  process: {
    vsc_vars: Awaited<ReturnType<typeof parseTypeDef>>;
    log: {
      build_frontend: string;
      build_typings: string;
      build_backend: string;
      build_tailwind: string;
      run_server: string;
    };
    is_ready: {
      frontend: boolean;
      typings: boolean;
    };
  };
  prasi: {
    frontend: { index: string; internal: string; typings: string };
    backend: { index: string };
    log_path: {
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
  process: {
    build_frontend?: Awaited<ReturnType<typeof bunWatchBuild>>;
    build_backend?: ReturnType<typeof spawn>;
    run_backend?: {
      spawn: ReturnType<typeof spawn>;
      port: number;
      send: (
        arg: { type: "reload-backend" } | { type: "reload-frontend" }
      ) => void;
    };
    build_typings?: ReturnType<typeof spawn>;
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
