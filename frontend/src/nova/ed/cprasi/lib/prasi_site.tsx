import { SiteSettings } from "./typings";

export const prasi_site = {
  id: "",
  name: "Mantap jiwa",
  save(settings: SiteSettings) {},
  async load() {
    // const site = await _db.site.findFirst({
    //   where: { id },
    //   select: { settings: true, config: true, deploy_target: true },
    // });
    return null as unknown as SiteSettings;
  },
};
