export const typingsItem = `
const cx = null as ((...classNames: any[]) => string);
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
