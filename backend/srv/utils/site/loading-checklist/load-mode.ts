import { fs } from "utils/fs";
import type { PrasiSiteLoading } from "../../global";
import { siteLoadingMessage } from "./loading-msg";
import { siteRun } from "./site-run";

export const siteLoadingMode = async (
  site_id: string,
  loading: PrasiSiteLoading
) => {
  siteLoadingMessage(site_id, "Checking files...");

  const old_exists = await fs.exists(`code:${site_id}/site/src/index.tsx`);
  if (old_exists) {
    loading.mode = "upgrade";
  } else {
    const new_exists = await fs.exists(
      `code:${site_id}/vsc/frontend/index.tsx`
    ); 
    if (new_exists) {
      loading.mode = "run";
    } else {
      loading.mode = "new";
      siteRun(site_id, loading);
    }
  }
  return loading.mode;
};
