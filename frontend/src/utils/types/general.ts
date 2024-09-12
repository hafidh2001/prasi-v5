import { PrismaClient } from "prasi-db";

export type PageProps = {
  pathname: string;
  domain: string;
  params: any;
};

export type PrasiAPI = {
  apiEntry: any;
  prismaTypes?: {
    "prisma.d.ts": string;
    "runtime/library.d.ts": string;
    "runtime/index.d.ts": string;
  };
  apiTypes?: string;
};

declare global {
  const _db: PrismaClient;
}
export {};

export const w = window as unknown as {
  isEditor: boolean;
  isMobile: boolean;
  basehost?: string;
  basepath: string;
  navigateOverride: (s: string) => string;
  isDesktop: boolean;
  prasiApi: Record<string, PrasiAPI>;
  prasiContext: {
    render: () => void;
    renderEditor?: () => void;
    afterEditorRender?: () => void;
  };
  loadedFonts: string[];
  prasiApiDbPull: boolean;
  mobile?: any;
  params: any;
  editorGlbDefault: string;
  ts: number;
  serverurl: string;
  apiurl: string;
  _api: any;
  _db: any;
  offline: boolean;
  sync_too_long: boolean;
  editorRender?: () => void;
  debug: {
    on: any;
    off: any;
  };
  pointer_active: boolean;
};
