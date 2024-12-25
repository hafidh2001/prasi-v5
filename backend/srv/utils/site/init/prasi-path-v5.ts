import { fs } from "utils/files/fs";

export const prasi_path_v5 = (site_id: string) => ({
  index: "frontend/index.tsx",
  internal: "frontend/internal.tsx",
  server: "backend/server.ts",
  typings: "system/typings/generated.d.ts",
  dir: {
    script: fs.path(`code:${site_id}/site/build/frontend`),
    upload: fs.path(`code:${site_id}/site/upload`),
    public: fs.path(`code:${site_id}/site/src/frontend/public`),
  },
});
