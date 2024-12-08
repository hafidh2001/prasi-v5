import { fs } from "utils/files/fs";
import { parseTypeDef } from "utils/parser/parse-type-def";

export const extractVscIndex = async (site_id: string) => {
  const site = g.site.loaded[site_id];

  if (
    site &&
    fs.exists(`code:${site_id}/site/src/types/typings-generated.d.ts`)
  ) {
    const result = await parseTypeDef(
      fs.path(`code:${site_id}/site/src/types/typings-generated.d.ts`)
    );
    site.build_result.vsc_vars = result;
  }
};
