import type { PrasiSiteLoading } from "../../global";
import { siteLoadingMessage } from "./loading-msg";

export const siteLoadingCheckDir = (
  site_id: string,
  loading: PrasiSiteLoading
) => {
  siteLoadingMessage(site_id, "Checking files...");
};
