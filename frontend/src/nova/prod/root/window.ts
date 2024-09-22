import { FC } from "react";
import { EPage } from "../../ed/logic/types";
import { IItem } from "../../../utils/types/item";

export const w = window as unknown as {
  prasiContext: {
    global: any;
    render: () => void;
  };
  params: any;
  navigateOverride: (href: string) => void;
  pointerActive: boolean;
  ContentLoading?: FC;
  ContentNotFound?: FC;
  _prasi: {
    basepath: string;
    site_id: string;
    page_id?: string;
    params?: any;
    routed?: {
      page_id?: string;
      params?: any;
    };
  };
  serverurl: string;
  siteurl: (pathname: string, forceOriginal?: boolean) => string;
  isEditor: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  preloaded: (url: string) => boolean;
  preload: (
    urls: string[],
    opt: {
      on_load: (
        pages: {
          id: string;
          url: string;
          content_tree: EPage["content_tree"];
        }[],
        walk: (
          root: { content_tree: EPage["content_tree"] }[],
          visit: (item: IItem) => void | Promise<void>
        ) => void
      ) => void;
    }
  ) => Promise<void>;
};
