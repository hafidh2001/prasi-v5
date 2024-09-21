import { FC } from "react";

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
};
