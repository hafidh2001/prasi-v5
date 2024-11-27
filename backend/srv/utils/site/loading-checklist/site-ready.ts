import { removeAsync } from "fs-jetpack";
import { PRASI_CORE_SITE_ID, waitUntil } from "prasi-utils";
import sync from "sync-directory";
import { editor } from "utils/editor";
import { fs } from "utils/fs";
import { staticFile } from "utils/static";

export const siteReady = async (site_id: string) => {
  if (!g.site.loading[site_id]) {
    await waitUntil(() => g.site.loading[site_id]);
  }

  if (site_id === PRASI_CORE_SITE_ID) {
    waitUntil(() => fs.exists(`code:${site_id}/vsc/dist/dev`), {
      interval: 300,
    }).then(async () => {
      await removeAsync(fs.path(`root:backend/srv/psc`));
      sync(
        fs.path(`code:${site_id}/vsc/dist/dev`),
        fs.path(`root:backend/srv/psc`),
        {
          watch: true,
          type: "copy",
          supportSymlink: false
        }
      );
    });
  } 

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
