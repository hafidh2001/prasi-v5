import { editor } from "../../editor";

export const siteLoadingMessage = (site_id: string, status: string) => {
  const loading = g.site.loading[site_id];
  loading.status = status;
  editor.broadcast(
    { site_id },
    { action: "site-loading", status: loading.status }
  );
};

export const siteBroadcastBuildLog = (site_id: string, log: string) => {
  editor.broadcast({ site_id }, { action: "site-build-log", log });
};
