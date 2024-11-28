import { fs } from "utils/fs";
import type { PrasiSiteLoading } from "utils/global";
import { siteRun } from "./site-run";

export const siteNew = async (site_id: string, loading: PrasiSiteLoading) => {
  await fs.copy(`root:backend/template/site`, `code:${site_id}/vsc`);

  loading.mode = "run";

  await siteRun(site_id, loading);
};
