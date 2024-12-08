import { editor } from "utils/editor";
import { validate } from "uuid";
import { siteLoadingData } from "./loading-checklist/load-data";
import { siteLoadingMessage } from "./loading-checklist/loading-msg";
import { fs } from "utils/files/fs";
import { initPrasiJson } from "./loading-checklist/prasi-json";
import { siteRun } from "./loading-checklist/site-run";
import { siteLoaded } from "./loading-checklist/site-loaded";

export const siteInit = async (site_id: string, conn_id?: string) => {
  if (!validate(site_id)) {
    console.log(`Warning, opening invalid site_id: ${site_id}`);
    return;
  }

  if (!g.site.loaded[site_id]) {
    let loading = g.site.loading[site_id];
    if (!loading) {
      g.site.loading[site_id] = {
        status: "",
        build: {},
      };
      loading = g.site.loading[site_id];
      siteLoadingMessage(site_id, "Site Initializing...");

      await siteLoadingData(site_id, loading);

      siteLoadingMessage(site_id, "Loading files...");
      if (!fs.exists(`code:${site_id}/site/src`)) {
        await fs.copy(`root:backend/template/site`, `code:${site_id}/site/src`);
      }

      if (!fs.exists(`code:${site_id}/site/src/prasi.json`)) {
        await initPrasiJson(site_id);
      }
      await siteRun(site_id, loading);
    } else if (conn_id) {
      editor.send(conn_id, { action: "site-loading", status: loading.status });
      if (loading.build.frontend) {
        editor.send(conn_id, {
          action: "site-build-log",
          log: loading.build.frontend.log,
        });
      }
    }
  } else if (conn_id) {
    editor.send(conn_id, {
      action: "site-ready",
      site: g.site.loaded[site_id].data,
    });
  }
};
