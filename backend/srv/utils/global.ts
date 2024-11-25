import type { PrismaClient } from "prasi-db";
import type { staticFile } from "./static";
import type { ShellPromise, Subprocess } from "bun";
import type { ESite } from "prasi-frontend/src/nova/ed/logic/types";
import type { spawn } from "./spawn";

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
export type PrasiSiteLoading = {
  status: string;
  data?: ESite;
  mode?: "new" | "upgrade" | "run";
  deps_install?: ShellPromise;
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
}

declare global {
  var g: PrasiGlobal;
  var _db: PrismaClient;
}
