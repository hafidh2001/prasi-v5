import { siteLoadingCheckDir } from "./loading-checklist/check-dir";
import { siteLoadingData } from "./loading-checklist/load-data";
import { siteLoadingMessage } from "./loading-checklist/loading-msg";

export const siteInit = async (site_id: string) => {
  if (!g.site.loaded[site_id]) {
    if (!g.site.loading[site_id]) {
      g.site.loading[site_id] = {
        status: "",
      };
      siteLoadingMessage(site_id, "Site Initializing...");
    }

    const loading = g.site.loading[site_id];
    siteLoadingData(site_id, loading);
    siteLoadingCheckDir(site_id, loading);
  }
};
