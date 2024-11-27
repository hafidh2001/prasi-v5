import { PRASI_CORE_SITE_ID } from "prasi-utils";
import { editor } from "utils/editor";
import { fs } from "utils/fs";
import { staticFile } from "utils/static";

export const siteReady = async (site_id: string) => {
  const loading = g.site.loading[site_id];
  g.site.loaded[site_id] = {
    build: loading.build,
    data: loading.data!,
    config: {},
    id: site_id,
    asset: await staticFile(fs.path(`code:${site_id}/vsc/dist/dev/static`)),
  };
  delete g.site.loading[site_id];


  editor.broadcast(
    { site_id },
    { action: "site-ready", site: g.site.loaded[site_id].data }
  );
};
