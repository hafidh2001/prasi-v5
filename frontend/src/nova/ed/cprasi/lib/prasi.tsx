import { prasi_db } from "./prasi_db";
import { prasi_site } from "./prasi_site";
export type { DeployTarget, SiteSettings } from "./typings";
export const prasi = {
  site: prasi_site,
  db: prasi_db,
};
