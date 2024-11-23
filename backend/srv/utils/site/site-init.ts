import { editor } from "../editor";

export const siteInit = async (site_id: string) => {
  if (!g.site.loaded[site_id]) {
    if (!g.site.loading[site_id]) {
      g.site.loading[site_id] = { status: "Site Initializing..." };
    }

    const loading = g.site.loading[site_id];
    editor.broadcast(
      { site_id },
      { action: "site-loading", status: loading.status }
    );
  }
};
