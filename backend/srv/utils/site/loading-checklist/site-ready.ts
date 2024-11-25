import { editor } from "utils/editor";

export const siteReady = (site_id: string) => {
  const loading = g.site.loading[site_id];
  g.site.loaded[site_id] = {
    build: loading.build,
    data: loading.data!,
    config: {},
    id: site_id,
  };
  delete g.site.loading[site_id];

  editor.broadcast(
    { site_id },
    { action: "site-ready", site: g.site.loaded[site_id].data }
  );
};
