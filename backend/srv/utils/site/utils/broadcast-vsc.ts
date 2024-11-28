export const broadcastVscUpdate = (
  site_id: string,
  from: "rsbuild" | "tsc"
) => {
  const site = g.site.loaded[site_id];
  if (site) {
    const pending = site.broadcasted;
    if (from === "rsbuild") pending.rsbuild = true;
    if (from === "tsc") pending.tsc = true;

    if (pending.rsbuild && pending.tsc) {
      console.log("broadcasting update ts");
    }
  }
};
