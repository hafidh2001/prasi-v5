import { fs } from "utils/fs";
import type { PrasiSiteLoading } from "../../global";
import { siteLoadingMessage } from "./loading-msg";
import { siteRun } from "./site-run";

export const siteLoadingMode = async (
  site_id: string,
  loading: PrasiSiteLoading
) => {
  siteLoadingMessage(site_id, "Checking files...");
  const old_exists = fs.exists(`code:${site_id}/site/frontend/index.tsx`);
  if (old_exists) {
    loading.mode = "upgrade";
  } else {
    const new_exists = fs.exists(`code:${site_id}/vsc/frontend/index.tsx`);

    if (new_exists) {
      loading.mode = "run";
    } else {
      loading.mode = "new";
    }
  }
  return loading.mode;
};
