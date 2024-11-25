import type { PrasiSiteLoading } from "../../global";
import { siteLoadingMessage } from "./loading-msg";

export const siteLoadingData = async (
  site_id: string,
  loading: PrasiSiteLoading
) => {
  if (!loading.data) {
    siteLoadingMessage(site_id, "Loading data...");
    loading.data = (await _db.site.findFirst({
      where: { id: site_id },
    })) as any;
  }
};
