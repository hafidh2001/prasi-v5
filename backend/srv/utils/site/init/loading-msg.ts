import { waitUntil } from "prasi-utils";
import { editor } from "../../editor";

export const siteLoadingMessage = async (site_id: string, status: string) => {
  let loading = g.site.loading[site_id];
  if (!loading) {
    await waitUntil(() => g.site.loading[site_id]);
  }
  loading.status = status;
  editor.broadcast(
    { site_id },
    { action: "site-loading", status: loading.status }
  );
};

export const siteBroadcastBuildLog = (site_id: string, log: string) => {
  const loading = g.site.loading[site_id];
  if (loading) {
    editor.broadcast({ site_id }, { action: "site-build-log", log });
  }
};

export const siteBroadcastTscLog = (site_id: string, log: string) => {
  const loading = g.site.loading[site_id];
  if (loading) {
    editor.broadcast({ site_id }, { action: "site-tsc-log", log });
  }
};
