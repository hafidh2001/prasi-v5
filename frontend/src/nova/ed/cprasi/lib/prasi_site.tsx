import { SiteSettings } from "./typings";

export const prasi_site = {
  save(settings: SiteSettings) {},
  async load(id: string) {
    const site = await _db.site.findFirst({
      where: { id },
      select: { settings: true, config: true, deploy_target: true },
    });
    return null as unknown as SiteSettings;
  },
};
