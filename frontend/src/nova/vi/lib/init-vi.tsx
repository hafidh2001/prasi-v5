import { w } from "../../prod/root/window";
import { ViProp } from "./types";

export const viInit = ({
  loader,
  enablePreload,
}: {
  loader: ViProp["loader"];
  enablePreload: boolean;
}) => {
  w.preloaded = (url: string) => {
    if (!enablePreload) return false;
    return false;
  };
  w.preload = (urls, opt) => {
    return new Promise<void>((done) => {
      if (!enablePreload) {
        done();
      }
    });
  };

  if (!w.serverurl) {
    const cur = new URL(location.href);
    w.serverurl = `${cur.protocol}//${cur.host}`;
  }

  w.siteurl = (pathname: string, forceOriginal?: boolean) => {
    if (pathname.startsWith("http://") || pathname.startsWith("https://"))
      return pathname;

    return pathname;
  };
};
