export const typingsItem = `
const cx = null as ((...classNames: any[]) => string);
const css: (
  tag: TemplateStringsArray | string,
  ...props: Array<string | number | boolean | undefined | null>
) => string;
const pathname: string;
const isEditor: boolean;
const isLayout: boolean;
const isMobile: boolean;
const isDesktop: boolean;
const __props: any;
const siteurl: (path:string) => string;
const preloaded: (url:string) => boolean;
const defineLocal: <T extends Record<string, any>>(arg: {value:T, name: string}) => T & { render: () => void };
const preload: (urls: string | string[], opt?: {
  on_load?: (
    pages: {
      id: string;
      url: string;
      root: IRoot;
    }[],
    walk: (
      root: { root: IRoot }[],
      visit: (item: IContent) => void | Promise<void>
    ) => void
  ) => void;}) => ReactNode;
const navigate: (url: string,
  params?: {
    name?: string;
    where?: any;
    create?: any;
    update?: any;
    breads?: { label: string; url?: string }[];
  }
) => void;
const params: any;
const props = null as {className: string} & Record<string, any>; 
const children = null as any;
const Local = null as (<T extends Record<string, any>>(arg: {
    name: string;
    idx?: any;
    value: T;
    children?: any;
    deps?: any[];
    effect?: (
      local: T & { render: () => void }
    ) => void | (() => void) | Promise<void | (() => void)>;
    hook?: (
      local: T & { render: () => void }
    ) => void | (() => void) | Promise<void | (() => void)>;
    cache?: boolean;
  }) => ReactElement);
`;
