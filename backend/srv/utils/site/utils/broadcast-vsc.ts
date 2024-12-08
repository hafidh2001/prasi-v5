import { gzipSync } from "bun";
import { editor } from "utils/editor";
import { fs } from "utils/files/fs";

export const broadcastVscUpdate = async (
  site_id: string,
  from: "frontend" | "tsc"
) => {
  const site = g.site.loaded[site_id];
  if (site) {
    const pending = site.broadcasted;
    if (from === "frontend") {
      pending.frontend = true;
      await site.asset!.rescan();
    }
    if (from === "tsc") pending.tsc = true;

    if (pending.frontend && pending.tsc) {
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
      pending.frontend = false;
      pending.tsc = false;
    }
  }
};
