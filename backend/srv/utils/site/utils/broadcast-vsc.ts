import { editor } from "utils/editor";
import { fs } from "utils/fs";
import { compress, init } from "@bokuweb/zstd-wasm";
init();

export const broadcastVscUpdate = async (
  site_id: string,
  from: "rsbuild" | "tsc"
) => {
  const site = g.site.loaded[site_id];
  if (site) {
    const pending = site.broadcasted;
    if (from === "rsbuild") pending.rsbuild = true;
    if (from === "tsc") pending.tsc = true;

    if (pending.rsbuild && pending.tsc) {
      const source = await fs.read(
        `code:${site_id}/vsc/dist/static/js/index.js`
      );
      const tsc = await fs.read(`code:${site_id}/vsc/typings-generated.d.ts`);
      editor.broadcast(
        { site_id },
        {
          action: "vsc-update",
          source: compress(source, 10),
          tsc: compress(tsc, 10),
          vars: site.build_result.vsc_vars,
        }
      );
      pending.rsbuild = false;
      pending.tsc = false;
    }
  }
};
