import { fs } from "utils/files/fs";
import type { PrasiSite } from "utils/global";

export const initPrasiJson = async (site_id: string) => {
  const json: PrasiSite["prasi"] = {
    frontend: {
      index: "",
      internal: "internal.tsx",
      typings: "typings/typings-generated.d.ts",
    },
    backend: { index: "" },

    log_path: {
      frontend: "log/frontend.log",
      backend: "log/backend.log",
      typings: "log/typings.log",
      tailwind: "log/tailwind.log",
    },
  };

  if (fs.exists(`code:${site_id}/site/src/index.tsx`)) {
    json.frontend.index = `index.tsx`;
  }
  if (fs.exists(`code:${site_id}/site/src/server.ts`)) {
    json.backend.index = `server.ts`;
  }

  if (fs.exists(`code:${site_id}/site/src/frontend/index.tsx`)) {
    json.frontend.index = `frontend/index.tsx`;
    json.frontend.internal = `frontend/internal.tsx`;
  }

  if (fs.exists(`code:${site_id}/site/src/backend/server.ts`)) {
    json.backend.index = `backend/server.ts`;
  }

  await fs.write(`code:${site_id}/site/src/prasi.json`, json);
};
