import { fs } from "utils/files/fs";
import type { PrasiSite } from "utils/global";
import { prasi_path_v5 } from "./prasi-path-v5";
import { prasi_path_v4 } from "./prasi-path-v4";

export const initPrasiJson = async (site_id: string) => {
  const json: PrasiSite["prasi"] = {
    version: 5,
    paths: prasi_path_v5(site_id),
  };

  if (fs.exists(`code:${site_id}/site/src/index.tsx`)) {
    json.version = 4;
    json.paths = prasi_path_v4(site_id);
  }

  await fs.write(`code:${site_id}/site/src/prasi.json`, json);
};
