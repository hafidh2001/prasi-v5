import { gzipSync } from "bun";
import { editor } from "utils/editor";
import { fs } from "utils/files/fs";

export const broadcastVscUpdate = async (
  site_id: string,
  from: "rsbuild" | "tsc"
) => {
  const site = g.site.loaded[site_id];
  if (site) {
    const pending = site.broadcasted;
    if (from === "rsbuild") {
      pending.rsbuild = true;
      await site.asset!.rescan();
    }
    if (from === "tsc") pending.tsc = true;

    if (pending.rsbuild && pending.tsc) {
      const tsc = await fs.read(
        `code:${site_id}/vsc/dist/typings-generated.d.ts`
      );

      editor.broadcast(
        { site_id },
        {
          action: "vsc-update",
          tsc: gzipSync(tsc),
          vars: site.build_result.vsc_vars,
        }
      );
      pending.rsbuild = false;
      pending.tsc = false;
    }
  }
};
