import { prasi_db } from "./prasi-db";
import { prasi_site } from "./prasi-site";
import type { PrismaClient } from "prasi-prisma";

export type { DeployTarget, SiteSettings } from "./typings";
export const prasi = {
  site: prasi_site,
  db: prasi_db,
};

const editor_db = null as unknown as PrismaClient;
