import { fs } from "utils/files/fs";

export const prasi_path_v4 = (site_id: string) => ({
  index: "index.tsx",
  internal: "internal.tsx",
  server: "server.ts",
  typings: "typings/generated.d.ts",
  dir: {
    site: fs.path(`code:${site_id}/site`),
    build: fs.path(`code:${site_id}/site/build/`),
    upload: fs.path(`code:${site_id}/site/upload`),
    public: fs.path(`code:${site_id}/site/src/public`),
  },
});
