import { editor } from "../../editor";

export const siteLoadingMessage = (site_id: string, status: string) => {
  const loading = g.site.loading[site_id];
  loading.status = status;
  editor.broadcast(
    { site_id },
    { action: "site-loading", status: loading.status }
  );
};
