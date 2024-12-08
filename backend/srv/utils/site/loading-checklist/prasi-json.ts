import { fs } from "utils/files/fs";
import type { PrasiSite, PrasiSiteLoading } from "utils/global";

export const initPrasiJson = async (
  site_id: string,
  loading: PrasiSiteLoading
) => {
  const json = {
    frontend: { index: "", internal: "internal.tsx" },
    backend: { index: "" },

    log: {
      frontend: "log/frontend.log",
      backend: "log/backend.log",
      typings: "log/typings.log",
      tailwind: "log/tailwind.log",
    },
  } as PrasiSite["prasi"];

  if (fs.exists(`code:${site_id}/site/src/index.tsx`)) {
    json.frontend.index = `index.tsx`;
  }
  if (fs.exists(`code:${site_id}/site/src/server.ts`)) {
    json.backend.index = `server.ts`;
  }

  await fs.write(`code:${site_id}/site/src/prasi.json`, json);
};
