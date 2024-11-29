import { PrasiDBEditor } from "./prasi-db/db-typings";
import { prasi_site } from "./prasi-site";

export type { DeployTarget, SiteSettings } from "./typings";
export const prasi = {
  site: prasi_site,
  db: _db as PrasiDBEditor,
};
