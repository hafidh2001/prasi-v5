declare module "utils/types/general" {
    import type { PrismaClient } from "prasi-db";
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
    global {
        const _db: PrismaClient;
    }
    export {};
    export const w: {
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
}
declare module "base/load/proxy" {
    export const fetchViaProxy: (target_url: string, data?: any, _headers?: any, parse_json?: boolean) => Promise<any>;
    export const getProxyUrl: (target_url: string) => string | URL;
}
declare module "base/load/api/api-proxy-def" {
    export const loadApiProxyDef: (_url: string, with_types: boolean) => Promise<void>;
}
declare module "base/load/api/api-proxy" {
    export type ApiProxy<T extends Record<string, any> = {}> = any;
    export const apiProxy: (api_url: string) => {} | null;
}
declare module "base/load/db/db-proxy" {
    export const dbProxy: (dburl: string) => {};
    export const fetchSendDb: (_params: Record<string, any>, dburl: string) => Promise<any>;
}
declare module "utils/script/create-id" {
    export { createId } from "@paralleldrive/cuid2";
}
declare module "utils/react/use-local" {
    export const useLocal: <T extends Record<string, any>>(data: T, effect?: () => Promise<void>, deps?: any[]) => { [K in keyof T]: T[K]; } & {
        render: () => void;
    };
}
declare module "utils/ui/loading" {
    import { FC, ReactElement, ReactNode } from "react";
    export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
        size?: number;
        className?: string;
    }
    export const LoadingSpinner: ({ size, className, ...props }: ISVGProps) => import("react/jsx-runtime").JSX.Element;
    export const Loading: FC<{
        children?: ReactNode;
        className?: string;
        show?: boolean;
        backdrop?: boolean;
        note?: ReactNode;
        alt?: ReactElement;
        pointer?: boolean;
    }>;
}
declare module "utils/react/navigate" {
    export const navigate: (href: string) => void;
}
declare module "utils/react/page" {
    import { FC } from "react";
    export const page: (arg: {
        url: string;
        component: FC<any>;
    }) => {
        url: string;
        component: FC<any>;
    };
}
declare module "utils/ui/form.style" {
    export const formStyle: string;
}
declare module "utils/ui/form/input" {
    import { FC } from "react";
    export const Input: FC<Omit<React.InputHTMLAttributes<HTMLInputElement>, "form" | "name" | "onChange"> & {
        form: Record<string, any> & {
            render: () => void;
        };
        name: string;
        onChange?: (text: string) => string | void;
    }>;
}
declare module "base/page/auth/login" {
    const _default: {
        url: string;
        component: import("react").FC<any>;
    };
    export default _default;
}
declare module "base/page/auth/logout" {
    const _default_1: {
        url: string;
        component: import("react").FC<any>;
    };
    export default _default_1;
}
declare module "base/page/auth/register" {
    const _default_2: {
        url: string;
        component: import("react").FC<any>;
    };
    export default _default_2;
}
declare module "nova/ed/popup/flow/runtime/lib/code-exec" {
    import { PFNodeRuntime } from "nova/ed/popup/flow/runtime/types";
    export const codeExec: (arg: {
        code: string;
        vars: Record<string, any>;
        node: PFNodeRuntime<any>;
        console: typeof console;
    }) => any;
}
declare module "nova/ed/popup/flow/runtime/lib/define-node" {
    import { PFNodeDefinition } from "nova/ed/popup/flow/runtime/types";
    export const defineNode: <T extends Record<string, any>, J extends Record<string, any>>(node: PFNodeDefinition<{ [K in keyof T]: any; }, J>) => PFNodeDefinition<{ [K in keyof T]: any; }, J>;
}
declare module "nova/ed/popup/flow/runtime/nodes/code" {
    export const nodeCode: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
        source_code: any;
    }, Record<string, any>>;
}
declare module "nova/ed/popup/flow/runtime/nodes/branch" {
    export const nodeBranch: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
        [x: string]: any;
    }, Record<string, any>>;
}
declare module "nova/ed/popup/flow/runtime/nodes/start" {
    export const nodeStart: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
        [x: string]: any;
    }, {
        jsx: boolean;
    }>;
}
declare module "nova/ed/popup/flow/runtime/nodes/react-output" {
    export const nodeReactOutput: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
        class_name: any;
    }, Record<string, any>>;
}
declare module "nova/ed/popup/flow/runtime/nodes/react-render" {
    export const nodeReactRender: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
        class_name: any;
    }, Record<string, any>>;
}
declare module "nova/ed/popup/flow/runtime/nodes" {
    export const allNodeDefinitions: {
        start: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
            [x: string]: any;
        }, {
            jsx: boolean;
        }>;
        code: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
            source_code: any;
        }, Record<string, any>>;
        branch: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
            [x: string]: any;
        }, Record<string, any>>;
        reactOutput: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
            class_name: any;
        }, Record<string, any>>;
        reactRender: import("nova/ed/popup/flow/runtime/types").PFNodeDefinition<{
            class_name: any;
        }, Record<string, any>>;
    };
    export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
}
declare module "nova/ed/popup/flow/runtime/types" {
    import { ReactElement } from "react";
    import { allNodeDefinitions } from "nova/ed/popup/flow/runtime/nodes";
    export type PFNodeID = string;
    export type PFNodeBranch = {
        code?: string;
        name?: string;
        flow: PFNodeID[];
        mode?: "async-only" | "sync-only" | "normal";
        idx?: number;
        meta?: {
            condition_id: string;
        };
    };
    export type PFNodePosition = {
        x: number;
        y: number;
    };
    export type PFNodeSize = {
        w?: number;
        h?: number;
    };
    export type PFNodeType = keyof typeof allNodeDefinitions;
    export type DeepReadonly<T> = T extends Function ? T : T extends object ? {
        readonly [K in keyof T]: DeepReadonly<T[K]>;
    } : T;
    export type PFNode<T = Record<string, any>> = T & {
        id: string;
        name?: string;
        type: string;
        vars?: Record<string, any>;
        branches?: PFNodeBranch[];
        position?: PFNodePosition;
        size?: PFNodeSize;
        _codeBuild?: Record<string, string>;
        _codeError?: Record<string, string>;
    };
    export type RPFlow = DeepReadonly<PFlow>;
    export type PFlow = {
        id: string;
        name: string;
        path?: string;
        nodes: Record<PFNodeID, PFNode>;
        flow: Record<string, PFNodeID[]>;
    };
    export type PFNodeRuntime<T extends Record<string, any>, K extends Record<string, any> = Record<string, any>> = {
        node: DeepReadonly<PFNode<K>> & T;
        prev?: DeepReadonly<PFNode<K>>;
        first: DeepReadonly<PFNode<K>>;
        visited: {
            node: DeepReadonly<PFNode<K>>;
            branch?: PFNodeBranch;
        }[];
    };
    export type PFRuntime = {
        nodes: DeepReadonly<PFNode>[];
    };
    export type PFNodeDefinition<F extends Record<string, PFField>, G extends Record<string, any> = Record<string, any>> = {
        type: string;
        className?: string;
        vars?: Record<string, any>;
        is_async?: boolean;
        icon: string;
        width?: number;
        default?: G;
        render_edge_label?: (arg: {
            node: DeepReadonly<PFNode<G>>;
            branch?: PFNodeBranch;
        }) => ReactElement;
        node_picker?: (def: PFNodeDefinition<any>) => void | {
            hidden: boolean;
        };
        on_before_connect?: (arg: {
            node: PFNode<G>;
            is_new: boolean;
            pflow: PFlow;
        }) => void;
        has_branches: boolean;
        on_after_connect?: (arg: {
            from: PFNode<G>;
            to: PFNode<G>;
        }) => void;
        on_before_disconnect?: (arg: {
            from: PFNode<G>;
            to: PFNode<G>;
            flow: PFNodeID[];
        }) => void;
        on_after_disconnect?: (arg: {
            from: PFNode<G>;
            to: PFNode<G>;
        }) => void;
        on_init?: (arg: {
            node: PFNode<G>;
            pflow: PFlow;
        }) => void;
        on_fields_changed?: (arg: {
            pflow: PFlow;
            node: PFNode<G>;
            path: string;
            action: string;
        }) => void;
        process: (arg: {
            vars: Record<string, any>;
            runtime: PFNodeRuntime<{
                [K in keyof F]: F[K];
            }, G>;
            processBranch: (branch: DeepReadonly<PFNodeBranch>) => Promise<void>;
            next: () => void;
            console: typeof console;
            state: {
                react?: {
                    effects: () => Promise<void>;
                    render: () => Promise<void>;
                    status?: "rendering" | "rendered" | "init";
                };
            };
        }) => void | Promise<void>;
        fields?: F;
    };
    export type PFField = ({
        type: "string";
        placeholder?: (arg: {
            node: DeepReadonly<PFNode>;
            path: string;
        }) => string;
    } | {
        type: "array";
        fields: Record<string, PFField>;
        render?: (arg: {
            node: DeepReadonly<PFNode>;
        }) => ReactElement;
    } | {
        type: "code";
    } | {
        type: "options" | "buttons";
        multiple?: boolean;
        options: () => Promise<(string | {
            value: string;
            label: string;
            el?: ReactElement;
        })[]>;
    }) & {
        idx?: number;
        label: string;
        optional?: boolean;
        className?: string;
    };
}
declare module "utils/script/types/base" {
    export const baseTypings = "\n  type FC<T> = React.FC<T>;\n  const Fragment: typeof React.Fragment;\n  const ReactNode: typeo React.ReactNode;\n  const useCallback: typeof React.useCallback;\n  const useMemo: typeof React.useMemo;\n  const ReactElement: typeof React.ReactElement;\n  const isValidElement: typeof React.isValidElement;\n  const useEffect: typeof React.useEffect;\n  const useState: typeof React.useState;\n\n  const prasi_internal: {\n    page: { id: string };\n  };\n\n  const pathname: string;\n  const isEditor: boolean;\n  const isLayout: boolean;\n  const isMobile: boolean;\n  const isDesktop: boolean;\n  const __props: any;\n  const siteurl: (path:string) => string;\n  const preloaded: (url:string) => boolean;\n  const preload: (urls: string | string[], opt?: {\n    on_load?: (\n      pages: {\n        id: string;\n        url: string;\n        root: IRoot;\n      }[],\n      walk: (\n        root: { root: IRoot }[],\n        visit: (item: IContent) => void | Promise<void>\n      ) => void\n    ) => void;}) => ReactNode;\n  const navigate: (url: string,\n    params?: {\n      name?: string;\n      where?: any;\n      create?: any;\n      update?: any;\n      breads?: { label: string; url?: string }[];\n    }\n  ) => void;\n  const params: any;\n  const cx: (...classNames: any[]) => string;\n  const css: (\n    tag: TemplateStringsArray | string,\n    ...props: Array<string | number | boolean | undefined | null>\n  ) => string;\n\n  const props: {\n    className: string;\n    onPointerDown?: () => void;\n    onPointerMove?: () => void;\n    onPointerLeave?: () => void;\n    inherit?: {\n      style: any,\n      className: string\n    }\n  };\n  const children: ReactElement;\n\n  type IItem = {\n    id: string;\n    name: string;\n    type: \"item\" | \"text\";\n    adv?: {\n      js?: string;\n      jsBuilt?: string;\n      css?: string;\n      html?: string;\n    };\n    text?: string;\n    html?: string;\n    component?: {\n      id: string;\n      props: Record<\n        string,\n        { type: \"string\" | \"raw\"; value: string; valueBuilt?: string }\n      >;\n    };\n    childs: IItem[];\n  };\n\n  type SingleChange =\n    | { type: \"set\"; name: string; value: any }\n    | ({ type: \"prop\"; name: string } & PropVal)\n    | { type: \"child\"; childs: SimpleItem[] };\n\n  export type PropVal =\n    | { mode: \"string\"; value: string }\n    | { mode: \"raw\"; value: string; valueBuilt?: string }\n    | { mode: \"jsx\"; value: null | (IItem & PrasiEdit) | SimpleItem };\n\n  type ParentArg = {\n    item: IItem & PrasiEdit;\n    child_type: \"jsx\" | \"child\";\n    child_idx: number;\n  };\n\n  type SimpleItem = Partial<Omit<IItem, \"component\">> & {\n    component?: { id: string; props: Record<string, PropVal> };\n  };\n\n  type PrasiEdit = {\n    edit: {\n      setValue: <T extends keyof IItem>(name: T, value: IItem[T]) => void;\n      setProp: (name: string, value: PropVal | string) => void;\n      pending: SingleChange[];\n      childs: (IItem & PrasiEdit)[];\n      setChilds: (childs: ((IItem & PrasiEdit) | SimpleItem)[]) => void;\n      readonly parent: null | ParentArg;\n      commit: () => Promise<void>;\n      readonly props?: Record<string, PropVal>;\n    };\n  };\n\n  type PrasiItem = IItem & PrasiEdit;\n  const _item: PrasiItem;\n  const _metas: Record<string, any>;\n  const _meta: {\n    item: any;\n    mitem?: any;\n    parent?: {\n      id: string;\n      instance_id?: string;\n      comp_id?: string;\n    };\n    instances?: Record<string, Record<string, string>>;\n    jsx_prop?: {\n      name: string;\n      comp_id: string;\n      is_root: boolean;\n      child?: {\n        prop_id: string;\n        comp_id: string;\n      };\n    };\n    editor_props?: any;\n    script?: {\n      scope?: any;\n      result: any;\n      Local: any;\n      PassProp: any;\n    };\n    render?: () => void;\n  };\n\n  const PassProp: (arg:Record<string, any> & { children: ReactNode }>) => ReactElement;\n  const mobile: {\n    notif: {\n      register: (user_id: string) => void;\n      send: (data: {\n        user_id: string;\n        title: string;\n        body: string;\n        data: any;\n      }) => void;\n      onTap: (\n        data: null | {\n          user_id: string;\n          title: string;\n          body: string;\n          data: any;\n        }\n      ) => void | Promise<void>;\n      onReceive: (data: {\n        user_id: string;\n        title: string;\n        body: string;\n        data: any;\n      }) => void | Promise<void>;\n    };\n  };\n  const Local: <T extends Record<string, any>>(arg: {\n    name: string;\n    idx?: any;\n    value: T;\n    children?: any;\n    deps?: any[];\n    effect?: (\n      local: T & { render: () => void }\n    ) => void | (() => void) | Promise<void | (() => void)>;\n    hook?: (\n      local: T & { render: () => void }\n    ) => void | (() => void) | Promise<void | (() => void)>;\n    cache?: boolean;\n  }) => ReactElement\n";
}
declare module "utils/script/types/prop" {
    export const extractProp: (prop: {
        values: Record<string, any>;
        types: Record<string, string>;
    }) => string[];
}
declare module "utils/script/typings" {
    import type { OnMount } from "@monaco-editor/react";
    export type MonacoEditor = Parameters<OnMount>[0];
    type Monaco = Parameters<OnMount>[1];
    export const registerSiteTypings: (monaco: Monaco, p: {
        site_dts: string;
        site_dts_entry: any;
    }) => void;
    export const monacoTypings: (p: {
        site_dts: string;
        prisma_ext: string;
        site_dts_entry: any;
        site: {
            api_url: string;
        };
        site_exports: Record<string, any>;
        script: {
            siteTypes: Record<string, string>;
        };
    }, monaco: Monaco, prop: {
        values: Record<string, any>;
        types: Record<string, string>;
    }) => Promise<void>;
    export const iftext: (condition: any, text: string) => string;
    export const register: (monaco: Monaco, source: string, uri: string) => void;
}
declare module "nova/ed/popup/script/jsx-highlight/worker/typescript/dev" {
    import * as Typescript from 'typescript';
    export { Typescript };
}
declare module "nova/ed/popup/script/jsx-highlight/worker/types" {
    import { Typescript } from "nova/ed/popup/script/jsx-highlight/worker/typescript/dev";
    export interface Position {
        row: number;
        column: number;
    }
    export interface Classification {
        start: Position;
        end: Position;
        tokens: string[];
    }
    export interface Config {
        /**
         * jsx tag 序号循环值
         * - 主要用作给相邻的tag渲染不同颜色作区分
         */
        jsxTagCycle: number;
        /**
         * 是否开启console
         */
        enableConsole?: boolean;
    }
    export interface Context {
        /**
         * 当前的jsx标签序号
         */
        jsxTagOrder: number;
    }
    export interface Data {
        node: Typescript.Node;
        lines: number[];
        context: Context;
        classifications: Classification[];
        config: Config;
        index: number;
    }
}
declare module "nova/ed/popup/script/jsx-highlight/get-worker" {
    export const getWorker: () => Worker;
}
declare module "nova/ed/popup/script/jsx-highlight/index" {
    export interface WorkerStringContainer {
        worker: string;
    }
    export interface Config {
        /**
         * 自定义 typescript.min.js url
         * - 只在worker来源为 json 模式下生效
         */
        customTypescriptUrl?: string;
    }
    /**
     * 高亮
     */
    export class MonacoJsxSyntaxHighlight {
        private worker;
        private monaco;
        constructor(worker: string | Worker | WorkerStringContainer, monaco: any, config?: Config);
        private createWorkerFromPureString;
        highlighterBuilder: (context: {
            editor: any;
            filePath?: string;
        }) => {
            highlighter: (code?: string) => void;
            dispose: () => void;
        };
    }
    export { getWorker } from "nova/ed/popup/script/jsx-highlight/get-worker";
}
declare module "nova/ed/popup/script/code/js/enable-jsx" {
    import type { OnMount } from "@monaco-editor/react";
    export type MonacoEditor = Parameters<OnMount>[0];
    export type Monaco = Parameters<OnMount>[1];
    export const monacoEnableJSX: (editor: MonacoEditor, monaco: Monaco, arg?: {}) => Promise<void>;
    export const register: (monaco: Monaco, source: string, uri: string) => void;
}
declare module "nova/ed/popup/script/code/js/fold-region-vstate" {
    export const foldRegionVState: (str: string[], vstate?: any) => any;
}
declare module "nova/ed/popup/script/parts/do-edit" {
    import { MonacoEditor } from "utils/script/typings";
    import { Monaco } from "nova/ed/popup/script/code/js/enable-jsx";
    export const defineScriptEdit: (editor: MonacoEditor, monaco: Monaco) => (fn: (arg: {
        body: string;
        imports: string[];
        wrapImports: (imports: string[]) => string;
    }) => Promise<string[]>) => Promise<void>;
}
declare module "nova/ed/right/events/ed-event-types" {
    export const EdEventTypes: {
        "On Init": {
            vars: {};
            desc: string;
        };
        "On Click": {
            vars: {};
            desc: string;
        };
        "On Hover": {
            vars: {};
            desc: string;
        };
        "On Leave": {
            vars: {};
            desc: string;
        };
    };
    export type EventType = keyof typeof EdEventTypes;
}
declare module "utils/ui/popover" {
    import { Placement } from "@floating-ui/react";
    import * as React from "react";
    interface PopoverOptions {
        initialOpen?: boolean;
        placement?: Placement;
        modal?: boolean;
        open?: boolean;
        offset?: number;
        onOpenChange?: (open: boolean) => void;
        autoFocus?: boolean;
        backdrop?: boolean | "self";
        border?: string;
        root?: HTMLElement;
    }
    export function usePopover({ initialOpen, placement, modal, open: controlledOpen, offset: popoverOffset, onOpenChange: setControlledOpen, autoFocus, backdrop, root, }?: PopoverOptions): {
        arrowRef: React.MutableRefObject<null>;
        modal: boolean | undefined;
        labelId: string | undefined;
        descriptionId: string | undefined;
        setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
        setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
        backdrop: boolean | "self";
        autoFocus: boolean;
        root: HTMLElement | undefined;
        placement: Placement;
        strategy: import("@floating-ui/utils").Strategy;
        middlewareData: import("@floating-ui/core").MiddlewareData;
        x: number;
        y: number;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: React.CSSProperties;
        refs: {
            reference: React.MutableRefObject<import("@floating-ui/react-dom").ReferenceType | null>;
            floating: React.MutableRefObject<HTMLElement | null>;
            setReference: (node: import("@floating-ui/react-dom").ReferenceType | null) => void;
            setFloating: (node: HTMLElement | null) => void;
        } & import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: {
            reference: import("@floating-ui/react-dom").ReferenceType | null;
            floating: HTMLElement | null;
        } & import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        context: {
            update: () => void;
            x: number;
            y: number;
            placement: Placement;
            strategy: import("@floating-ui/utils").Strategy;
            middlewareData: import("@floating-ui/core").MiddlewareData;
            isPositioned: boolean;
            floatingStyles: React.CSSProperties;
            open: boolean;
            onOpenChange: (open: boolean, event?: Event, reason?: import("@floating-ui/react").OpenChangeReason) => void;
            events: import("@floating-ui/react").FloatingEvents;
            dataRef: React.MutableRefObject<import("@floating-ui/react").ContextData>;
            nodeId: string | undefined;
            floatingId: string;
            refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
            elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        };
        getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
        getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
        getItemProps: (userProps?: Omit<React.HTMLProps<HTMLElement>, "selected" | "active"> & {
            active?: boolean;
            selected?: boolean;
        }) => Record<string, unknown>;
        open: boolean;
        setOpen: (open: boolean) => void;
    };
    export const usePopoverContext: () => {
        arrowRef: React.MutableRefObject<null>;
        modal: boolean | undefined;
        labelId: string | undefined;
        descriptionId: string | undefined;
        setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
        setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
        backdrop: boolean | "self";
        autoFocus: boolean;
        root: HTMLElement | undefined;
        placement: Placement;
        strategy: import("@floating-ui/utils").Strategy;
        middlewareData: import("@floating-ui/core").MiddlewareData;
        x: number;
        y: number;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: React.CSSProperties;
        refs: {
            reference: React.MutableRefObject<import("@floating-ui/react-dom").ReferenceType | null>;
            floating: React.MutableRefObject<HTMLElement | null>;
            setReference: (node: import("@floating-ui/react-dom").ReferenceType | null) => void;
            setFloating: (node: HTMLElement | null) => void;
        } & import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: {
            reference: import("@floating-ui/react-dom").ReferenceType | null;
            floating: HTMLElement | null;
        } & import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        context: {
            update: () => void;
            x: number;
            y: number;
            placement: Placement;
            strategy: import("@floating-ui/utils").Strategy;
            middlewareData: import("@floating-ui/core").MiddlewareData;
            isPositioned: boolean;
            floatingStyles: React.CSSProperties;
            open: boolean;
            onOpenChange: (open: boolean, event?: Event, reason?: import("@floating-ui/react").OpenChangeReason) => void;
            events: import("@floating-ui/react").FloatingEvents;
            dataRef: React.MutableRefObject<import("@floating-ui/react").ContextData>;
            nodeId: string | undefined;
            floatingId: string;
            refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
            elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        };
        getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
        getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
        getItemProps: (userProps?: Omit<React.HTMLProps<HTMLElement>, "selected" | "active"> & {
            active?: boolean;
            selected?: boolean;
        }) => Record<string, unknown>;
        open: boolean;
        setOpen: (open: boolean) => void;
    } & {
        setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
        setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    };
    export function Popover({ children, content, className, modal, popoverClassName, arrow, border, preload, zIndex, ...restOptions }: {
        className?: string;
        root?: HTMLElement;
        popoverClassName?: string;
        children: React.ReactNode;
        content?: React.ReactNode | ((arg: {
            close: () => void;
        }) => React.ReactNode);
        arrow?: boolean;
        asChild?: boolean;
        preload?: boolean;
        zIndex?: number;
    } & PopoverOptions): import("react/jsx-runtime").JSX.Element;
    interface PopoverTriggerProps {
        children: React.ReactNode;
        asChild?: boolean;
    }
    export const PopoverTrigger: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLElement> & PopoverTriggerProps, "ref"> & React.RefAttributes<HTMLElement>>;
    export const PopoverContent: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLDivElement> & {
        preloadContent?: boolean;
        zIndex?: number;
    }, "ref"> & React.RefAttributes<HTMLDivElement>>;
    export const PopoverHeading: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
    export const PopoverDescription: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;
    export const PopoverClose: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
}
declare module "utils/ui/tooltip" {
    import type { Placement } from "@floating-ui/react";
    import * as React from "react";
    interface TooltipOptions {
        initialOpen?: boolean;
        placement?: Placement;
        open?: boolean;
        offset?: number;
        onOpenChange?: (open: boolean) => void;
        delay?: number;
        asChild?: boolean;
    }
    export function useTooltip({ initialOpen, placement, open: controlledOpen, onOpenChange: setControlledOpen, delay, offset: tooltipOffset, }?: TooltipOptions): {
        placement: Placement;
        strategy: import("@floating-ui/utils").Strategy;
        middlewareData: import("@floating-ui/core").MiddlewareData;
        x: number;
        y: number;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: React.CSSProperties;
        refs: {
            reference: React.MutableRefObject<import("@floating-ui/react-dom").ReferenceType | null>;
            floating: React.MutableRefObject<HTMLElement | null>;
            setReference: (node: import("@floating-ui/react-dom").ReferenceType | null) => void;
            setFloating: (node: HTMLElement | null) => void;
        } & import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: {
            reference: import("@floating-ui/react-dom").ReferenceType | null;
            floating: HTMLElement | null;
        } & import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        context: {
            update: () => void;
            x: number;
            y: number;
            placement: Placement;
            strategy: import("@floating-ui/utils").Strategy;
            middlewareData: import("@floating-ui/core").MiddlewareData;
            isPositioned: boolean;
            floatingStyles: React.CSSProperties;
            open: boolean;
            onOpenChange: (open: boolean, event?: Event, reason?: import("@floating-ui/react").OpenChangeReason) => void;
            events: import("@floating-ui/react").FloatingEvents;
            dataRef: React.MutableRefObject<import("@floating-ui/react").ContextData>;
            nodeId: string | undefined;
            floatingId: string;
            refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
            elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        };
        getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
        getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
        getItemProps: (userProps?: Omit<React.HTMLProps<HTMLElement>, "selected" | "active"> & {
            active?: boolean;
            selected?: boolean;
        }) => Record<string, unknown>;
        open: boolean;
        setOpen: (open: boolean) => void;
        arrowRef: React.MutableRefObject<null>;
    };
    export const useTooltipContext: () => {
        placement: Placement;
        strategy: import("@floating-ui/utils").Strategy;
        middlewareData: import("@floating-ui/core").MiddlewareData;
        x: number;
        y: number;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: React.CSSProperties;
        refs: {
            reference: React.MutableRefObject<import("@floating-ui/react-dom").ReferenceType | null>;
            floating: React.MutableRefObject<HTMLElement | null>;
            setReference: (node: import("@floating-ui/react-dom").ReferenceType | null) => void;
            setFloating: (node: HTMLElement | null) => void;
        } & import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: {
            reference: import("@floating-ui/react-dom").ReferenceType | null;
            floating: HTMLElement | null;
        } & import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        context: {
            update: () => void;
            x: number;
            y: number;
            placement: Placement;
            strategy: import("@floating-ui/utils").Strategy;
            middlewareData: import("@floating-ui/core").MiddlewareData;
            isPositioned: boolean;
            floatingStyles: React.CSSProperties;
            open: boolean;
            onOpenChange: (open: boolean, event?: Event, reason?: import("@floating-ui/react").OpenChangeReason) => void;
            events: import("@floating-ui/react").FloatingEvents;
            dataRef: React.MutableRefObject<import("@floating-ui/react").ContextData>;
            nodeId: string | undefined;
            floatingId: string;
            refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
            elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        };
        getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
        getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
        getItemProps: (userProps?: Omit<React.HTMLProps<HTMLElement>, "selected" | "active"> & {
            active?: boolean;
            selected?: boolean;
        }) => Record<string, unknown>;
        open: boolean;
        setOpen: (open: boolean) => void;
        arrowRef: React.MutableRefObject<null>;
    };
    export function Tooltip({ children, content, className, onClick, onPointerEnter, onPointerLeave, asChild, ...options }: {
        children: React.ReactNode;
        content: React.ReactNode;
        className?: string;
        onClick?: (e: React.MouseEvent) => void;
        onPointerEnter?: (e: React.MouseEvent) => void;
        onPointerLeave?: (e: React.MouseEvent) => void;
    } & TooltipOptions): import("react/jsx-runtime").JSX.Element;
    export const TooltipTrigger: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLElement> & {
        asChild?: boolean;
    }, "ref"> & React.RefAttributes<HTMLElement>>;
    export const TooltipContent: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
}
declare module "nova/ed/popup/vars/lib/type-label" {
    import React from "react";
    import { EType } from "nova/ed/popup/vars/lib/type";
    export const EdTypeLabel: React.ForwardRefExoticComponent<{
        type: EType;
        show_label?: boolean;
        onClick?: (e: React.MouseEvent) => void;
    } & React.RefAttributes<HTMLDivElement>>;
}
declare module "nova/ed/popup/vars/lib/validate" {
    import { EBaseType, EType } from "nova/ed/popup/vars/lib/type";
    interface ValidationResult {
        valid: boolean;
        errorMessage?: string;
    }
    export const getBaseType: (type: EType) => EBaseType;
    export function validateValue<T extends EType>(value: any, type: T, path?: string): ValidationResult;
}
declare module "nova/ed/popup/vars/picker/picker-popup" {
    export const definePickerPopup: (local: {
        open: boolean;
        render: () => void;
    }, base_type: string, onChange: (type: any) => void) => ({ children, className, onClick, }: {
        className: string;
        children: any;
        onClick?: () => void;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/vars/lib/type" {
    import { ReactElement } from "react";
    import { definePickerPopup } from "nova/ed/popup/vars/picker/picker-popup";
    export type EType = ESimpleType | EArrayType | EObjectType;
    export type ESimpleType = "string" | "number" | "boolean" | "null";
    export type EBaseType = ESimpleType | "array" | "object";
    export type EArrayType = [EType];
    export type EObjectType = {
        [K in string]: EObjectEntry;
    };
    export type EObjectEntry = {
        type: EType;
        idx: number;
        optional?: boolean;
    };
    export type EVChildren = (arg: {
        open: () => void;
        type: EType;
        Item: ReturnType<typeof definePickerPopup>;
        depth: number;
        name?: string;
        path: string[];
        value: any;
        valuePath: string[];
        children: any;
        markChanged: (path: string[]) => void;
    }) => ReactElement;
}
declare module "nova/ed/popup/script/code/js/parse-item-types" {
    export type SingleExportVar = {
        name: string;
        type: "local";
        value: string;
        render_mode: "auto" | "manual";
    } | {
        type: "passprop";
        name: string;
        value: string;
        map?: {
            value?: string;
            item: string;
            idx?: string;
        };
    } | {
        type: "loop";
        name: string;
        list: string;
    };
}
declare module "utils/types/meta-fn" {
    import { SingleExportVar } from "nova/ed/popup/script/code/js/parse-item-types";
    import { IItem } from "utils/types/item";
    export type FNLayout = {
        dir: "row" | "col" | "row-reverse" | "col-reverse";
        align: FNAlign;
        gap: number | "auto";
        wrap?: "flex-wrap" | "flex-nowrap";
    };
    export type FNAdv = {
        scriptMode?: "script" | "flow";
        js?: string;
        jsBuilt?: string;
        css?: string;
        html?: string;
        tailwind?: string;
    };
    export type FNComponent = {
        id: string;
        props: Record<string, FNCompDef>;
        instances?: Record<string, Record<string, string>>;
        useStyle?: boolean;
        typings?: string;
        style?: IItem;
    };
    export type FNCompDef = {
        idx?: number;
        typings?: string;
        type?: string;
        label?: string;
        value?: any;
        valueBuilt?: any;
        gen?: string;
        genBuilt?: string;
        is_name?: boolean;
        onChange?: string;
        onChangeBuilt?: string;
        jsxPass?: {
            hash: string;
            exports: Record<string, SingleExportVar & {
                item_id: string;
            }>;
        };
        content?: IItem;
        visible?: string;
        meta?: FNCompMeta;
    };
    type FNCompMeta = {
        type: "file" | "text" | "option" | "content-element" | "list";
        options?: string;
        optionsBuilt?: string;
        option_mode?: "dropdown" | "button" | "checkbox";
        text_mode?: "string" | "code" | "var-picker";
    };
    export type FNAlign = "top-left" | "top-center" | "top-right" | "top" | "left" | "center" | "right" | "bottom" | "bottom-left" | "bottom-center" | "bottom-right" | "stretch";
    export type FNPadding = {
        t?: number;
        b?: number;
        l?: number;
        r?: number;
    };
    export type FNDimension = {
        w?: number | "fit" | "full";
        h?: number | "fit" | "full";
        wUnit?: "px" | "%";
        hUnit?: "px" | "%";
        proportion?: boolean;
    };
    export type FNBackground = {
        color?: string;
        url?: string;
        size?: "cover" | "contain" | "full" | "auto" | "%" | "px";
        repeat?: "repeat" | "repeat-x" | "repeat-y" | "space" | "round" | "no-repeat";
        pos?: "top" | "left" | "center" | "bottom" | "right";
    };
    export type FNBorder = {
        style?: "solid" | "dash";
        stroke?: FNBorderCorner;
        rounded?: FNRounded;
        color?: string;
    };
    export type FNBorderCorner = {
        t?: number;
        b?: number;
        l?: number;
        r?: number;
    };
    export type FNRounded = {
        tr?: number;
        tl?: number;
        bl?: number;
        br?: number;
    };
    export type FNFont = {
        color?: string;
        size?: number;
        family?: string;
        height?: number | "auto";
        align?: "center" | "left" | "right";
        whitespace?: "whitespace-normal" | "whitespace-nowrap" | "whitespace-pre" | "whitespace-pre-line" | "whitespace-pre-wrap" | "whitespace-break-spaces";
        wordBreak?: "break-normal" | "break-words" | "break-all" | "break-keep";
    };
    export type FNLinkTag = {
        tag?: string;
        link?: string;
        class?: string;
    };
}
declare module "utils/types/meta" {
    import { FNBackground, FNBorder, FNDimension, FNFont, FNPadding } from "utils/types/meta-fn";
    export type MetaItem = {
        id: string;
        originalId?: string;
        type: "text" | "section" | "item";
        name: string;
        field?: string;
        html?: string;
        text?: string;
        hidden?: "only-editor" | "all" | false;
    };
    export type BasicItem = {
        padding?: FNPadding;
        bg?: FNBackground;
        font?: FNFont;
        dim?: FNDimension;
        border?: FNBorder;
        typings?: string;
    };
}
declare module "nova/ed/popup/expr/lib/types" {
    import { PG } from "nova/ed/logic/ed-global";
    import { EBaseType, ESimpleType, EType } from "nova/ed/popup/vars/lib/type";
    import { FC } from "react";
    import { VarUsage } from "utils/types/item";
    export type EXPR_NAME = string;
    export type PExprField = {
        kind: "expression";
        expected_type?: EBaseType;
        optional?: boolean;
        multiple?: boolean;
        label: string;
        desc?: string;
        only_expr?: EXPR_NAME[];
    } | {
        kind: "options";
        options: string[];
        optional?: boolean;
    };
    export type PExprFields = Record<string, PExprField>;
    export type EDeepType = {
        simple: EOutputType;
        type: EType;
    };
    export type EOutputType = ESimpleType | "object" | "array" | "any";
    export type PExprDefinition<T extends PExprFields> = {
        name: EXPR_NAME;
        label: string;
        fields: T;
        group: string;
        desc: string;
        output_type: Readonly<EOutputType>;
        Component: ExprComponent<T>;
        infer: (arg: {
            p: PG;
            current: PTypedExpr<T>;
            item_id: string;
            prev: EDeepType[];
        }) => EDeepType[];
        evaluate: (current: PTypedExpr<T>) => {
            value: any;
            type: EType;
        };
    };
    export type ExprComponent<T extends PExprFields> = FC<{
        value: PTypedExpr<T>;
        expected_type?: EOutputType[];
        onChange: (expr: PExpr) => void;
        onFocusChange?: (focus: boolean) => void;
    }>;
    export const defineExpression: <T extends PExprFields>(expr: PExprDefinition<T>) => PExprDefinition<T>;
    export type PExpr = ({
        kind: "static";
        value?: any;
        type: ESimpleType;
    } | {
        kind: "var";
        var?: VarUsage;
    } | {
        kind: "expr";
        name: string;
        expr: Record<string, PExpr>;
    }) & {
        history?: Record<string, PExpr>;
    };
    export type PTypedExpr<T extends PExprFields> = {
        name: string;
        kind: "expr";
        expr: {
            [K in keyof T]: T[K]["kind"] extends "expression" ? PExpr : any;
        };
        history?: Record<string, PExpr>;
    };
    export const ExprBackdrop = true;
}
declare module "utils/types/item" {
    import { PFlow } from "nova/ed/popup/flow/runtime/types";
    import { EventType } from "nova/ed/right/events/ed-event-types";
    import { EBaseType, EType } from "nova/ed/popup/vars/lib/type";
    import { BasicItem, MetaItem } from "utils/types/meta";
    import { FNAdv, FNComponent, FNLayout, FNLinkTag } from "utils/types/meta-fn";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export type IItem = {
        layout?: FNLayout;
        linktag?: FNLinkTag;
        mobile?: IItem;
        adv?: FNAdv;
        type: "item" | "section" | "text";
        component?: FNComponent;
        tree_hidden?: boolean;
        text?: string;
        html?: string;
        events?: Record<EventType, {
            flow: PFlow;
        }>;
        vars?: Record<string, IVar<any>>;
        loop?: PExpr;
        content?: PExpr;
        childs: IItem[];
    } & MetaItem & BasicItem;
    type ITEM_ID = string;
    type PROP_NAME = string;
    type VAR_PATH = string;
    type FLOW_NODE_ID = string;
    export type IFlowOrVar = {
        mode: "var" | "expr";
        expr?: PExpr;
        var?: VarUsage;
    };
    export type IVar<T extends EType> = {
        id: string;
        name: string;
        type: T;
        default?: any;
        promise?: boolean;
        usage: Record<ITEM_ID, Partial<{
            event: Record<EventType, FLOW_NODE_ID[]>;
            loop: boolean;
            content: boolean;
            props: Record<PROP_NAME, FLOW_NODE_ID[]>;
        }>>;
        history: {
            type: Partial<Record<EBaseType, Record<VAR_PATH, EType>>>;
            value: Partial<Record<EBaseType, any>>;
        };
    };
    export type VarUsage = {
        var_id: string;
        path?: VAR_PATH[];
        error?: string;
    };
}
declare module "nova/ed/cprasi/lib/typings" {
    export type DEPLOY_TARGET_NAME = string;
    export type DeployTarget = {
        name: DEPLOY_TARGET_NAME;
        domain: string;
        dburl: string;
    };
    export const internal: unique symbol;
    export type SiteSettings = {
        prasi: {
            file: {
                upload_to: DEPLOY_TARGET_NAME;
            };
            db: {
                use: "deploy-target" | "db-url";
                connect_to: DEPLOY_TARGET_NAME;
                db_url: string;
            };
        };
        deploy_targets: DeployTarget[];
    };
}
declare module "nova/ed/logic/types" {
    import { page, site } from "prasi-db";
    import { IItem } from "utils/types/item";
    import { SiteSettings } from "nova/ed/cprasi/lib/typings";
    export type SyncUndoItem = {
        id: number;
        ts: number;
        size: string;
    };
    export type ESite = Omit<site, "config" | "settings"> & {
        config: {
            api_url: string;
        };
        settings: null | SiteSettings;
    };
    export type EPageContentTree = {
        childs: IItem[];
        component_ids: string[];
        id: string;
        id_page: string;
        responsive: "mobile" | "desktop";
        type: "root";
    };
    export type EPage = Omit<page, "content_tree"> & {
        content_tree: EPageContentTree;
    };
    export type EBaseComp = {
        id: string;
        content_tree: IItem;
        id_component_group: string | null;
        color: string | null;
    };
    export type EComp = EBaseComp & {
        tree: {
            find: (fn: (node: {
                item: IItem;
                parent?: string;
            }) => boolean) => IItem | null;
        };
    };
    export type PropFieldKind = "onChange" | "visible" | "gen" | "value" | "option" | "typings";
    export type PNode = {
        item: IItem;
        path_ids: string[];
        path_names: string[];
        parent?: {
            id: string;
            component?: {
                is_jsx_root?: boolean;
                comp_id: string;
                instance_id: string;
                prop_name: string;
            };
        };
    };
}
declare module "utils/sync/type" {
    import { ESite } from "nova/ed/logic/types";
    export type WSReceiveMsg = {
        action: "connected";
        conn_id: string;
    } | {
        action: "site-loading";
        status: string;
    } | {
        action: "site-ready";
        site: ESite;
    } | {
        action: "site-build-log";
        log: string;
    } | {
        action: "vsc-update";
        vars: Record<string, any>;
        tsc: Uint8Array;
    } | {
        action: "site-tsc-log";
        log: string;
    };
}
declare module "utils/react/use-global" {
    import { useState } from "react";
    export const GlobalContext: import("react").Context<{
        global: Record<string, any>;
        render: (reset?: boolean) => void;
    }>;
    import decircular from "decircular";
    export const uState: typeof useState;
    export const useGlobal: <T extends object>(defaultValue: T, id: string) => T & {
        render: (reset?: boolean) => void;
    };
    export const deepClone: typeof decircular;
}
declare module "utils/react/define-store" {
    import { Snapshot } from "valtio";
    export const StoreProvider: ({ children }: {
        children: any;
    }) => import("react/jsx-runtime").JSX.Element;
    export const rawStore: <T>(name: string) => () => {
        state: any;
        ref: any;
    };
    export const defineStore: <R, T extends object, K extends { [V in string]: (...arg: any[]) => void | boolean; }, D>(init: {
        name: string;
        state: T;
        ref?: R;
        action: (arg: {
            ref: R;
            state: T;
            update: (fn: (state: T) => void) => void;
        }) => K;
        effect?: (arg: {
            state: Snapshot<T>;
        }) => {
            deps: any[];
            effect: (arg: {
                state: Snapshot<T>;
                action: K;
                update: (fn: (state: T) => void) => void;
            }) => Promise<void>;
            cleanup?: () => void;
        }[];
    }) => <Z extends object>(selector: (arg: {
        ref: R;
        state: Snapshot<T>;
        action: K;
    }) => Z, instance_name?: string) => Z & {
        update: (fn: (state: T) => void) => void;
    };
}
declare module "nova/vi/lib/comp-args" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { IItem } from "utils/types/item";
    import { ViComps } from "nova/vi/lib/types";
    export const compArgs: (item: DeepReadonly<IItem>, comps: ViComps, existing: any, db: any, api: any, vscode_exports: any, standalone?: string) => any;
    export const replacement: {
        "stroke-width": string;
        "fill-rule": string;
        "clip-rule": string;
        "stroke-linejoin": string;
        "stroke-linecap": string;
        "clip-path": string;
        "stroke-miterlimit": string;
    };
    export const replaceWithObject: (tpl: string, data: any) => string;
}
declare module "nova/vi/lib/responsive-val" {
    export const responsiveVal: <T>(item: any, key: string, mode: "desktop" | "mobile" | undefined, defaultVal: T) => T;
}
declare module "utils/css/advanced" {
    import { MetaItem } from "utils/types/meta";
    import { FNAdv } from "utils/types/meta-fn";
    export const cssAdv: (cur: {
        adv?: FNAdv;
        type: MetaItem["type"];
    }, mode: "mobile" | "desktop") => string;
}
declare module "utils/css/background" {
    import { MetaItem } from "utils/types/meta";
    import { FNBackground } from "utils/types/meta-fn";
    export const cssBackground: (cur: {
        bg?: FNBackground;
        type: MetaItem["type"];
    }, mode?: "mobile" | "desktop") => string;
}
declare module "utils/css/border" {
    import { FNBorder } from "utils/types/meta-fn";
    export const cssBorder: (cur: {
        border?: FNBorder;
    }, mode?: "mobile" | "desktop") => string;
}
declare module "utils/css/dimension" {
    import { MetaItem } from "utils/types/meta";
    import { FNDimension } from "utils/types/meta-fn";
    export const cssDimension: (cur: {
        dim?: FNDimension;
        type: MetaItem["type"];
    }, mode?: "mobile" | "desktop", editor?: boolean) => string;
}
declare module "utils/css/editor" {
    import { IItem } from "utils/types/item";
    export const cssEditor: ({ item, hover, active, }: {
        item: IItem;
        hover?: boolean;
        active?: boolean;
    }) => string;
}
declare module "utils/css/font" {
    import { MetaItem } from "utils/types/meta";
    import { FNFont } from "utils/types/meta-fn";
    export const glbFont: {
        defaultFont: string;
        loadedFonts: string[];
    };
    export const cssFont: (cur: {
        font?: FNFont;
        type: MetaItem["type"];
    }, mode?: "mobile" | "desktop") => string;
}
declare module "utils/css/layout" {
    import { FNLayout } from "utils/types/meta-fn";
    export const cssLayout: (cur: {
        layout?: FNLayout;
    }, mode?: "mobile" | "desktop") => string;
}
declare module "utils/css/padding" {
    import { FNPadding } from "utils/types/meta-fn";
    export const cssPadding: (cur: {
        padding?: FNPadding;
    }, mode?: "mobile" | "desktop") => string;
}
declare module "utils/css/gen" {
    import { IItem } from "utils/types/item";
    export const produceCSS: (item: IItem, arg: {
        mode: "mobile" | "desktop";
        hover?: boolean;
        active?: boolean;
        editor?: boolean;
    }) => string;
}
declare module "nova/vi/lib/gen-parts" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { IItem } from "utils/types/item";
    export type DIV_PROPS = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    export const viDivProps: (item: DeepReadonly<IItem>, opt: {
        mode: "desktop" | "mobile";
        div_props?: DIV_PROPS;
    }) => import("react").ClassAttributes<HTMLDivElement> & import("react").HTMLAttributes<HTMLDivElement> & {
        inherit?: {
            style: IItem;
            className: string;
        };
    };
}
declare module "nova/vi/lib/parent-comp-args" {
    export const parentCompArgs: (parents: Record<string, string>, ref_comps: Record<string, any>, id: string) => any;
}
declare module "nova/vi/vi-child" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { ViMergedProps } from "nova/vi/lib/types";
    export const ViChilds: FC<{
        item: DeepReadonly<{
            id: string;
            childs: IItem[];
        }>;
        is_layout: boolean;
        instance_id?: string;
        merged?: ViMergedProps;
        standalone?: string;
    }>;
}
declare module "nova/ed/crdt/node/rapidhash" {
    type RapidMumBehaviour = "fast" | "protected";
    interface RapidhashOptions {
        seed: bigint;
        rapidMumBehaviour: RapidMumBehaviour;
    }
    /**
     * Calculate a 64-bit hash value of the given message.
     *
     * @param message {string|Uint8Array|DataView} The message to be hashed.
     * @param options Options for modifying the hash calculation.
     * @param options.seed {bigint} 64-bit unsigned seed value.
     * @param options.rapidMumBehaviour {'fast'|'protected'} Alters behaviour of the rapid_mum function. Defaults to 'fast'.
     */
    export function rapidhash(message: string | Uint8Array | DataView, options?: Partial<RapidhashOptions>): bigint;
    /**
     * Calculate a 64-bit hash value of the given message.
     * This function is equivalent to rapidhash() with options.rapidMumBehaviour set to 'fast'.
     *
     * @param message {string|Uint8Array|DataView} The message to be hashed.
     * @param options Options for modifying the hash calculation.
     * @param options.seed {bigint} 64-bit unsigned seed value.
     */
    export function rapidhash_fast(message: string | Uint8Array | DataView, options?: Partial<Omit<RapidhashOptions, "rapidMumBehaviour">>): bigint;
    /**
     * Calculate a 64-bit hash value of the given message.
     * This function is equivalent to rapidhash() with options.rapidMumBehaviour set to 'protected'.
     *
     * @param message {string|Uint8Array|DataView} The message to be hashed.
     * @param options Options for modifying the hash calculation.
     * @param options.seed {bigint} 64-bit unsigned seed value.
     */
    export function rapidhash_protected(message: string | Uint8Array | DataView, options?: Partial<Omit<RapidhashOptions, "rapidMumBehaviour">>): bigint;
}
declare module "nova/vi/lib/error-box" {
    import { PNode } from "nova/ed/logic/types";
    import { ReactNode } from "react";
    export const ErrorBox: (props: import("react").PropsWithChildren<{
        children: any;
        error_jsx?: ReactNode;
        node?: PNode;
        id?: string;
        silent?: boolean;
        onError?: (error: any) => void;
    }>) => import("react").ReactElement<any, any>;
}
declare module "nova/vi/lib/script-args" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import * as React from "react";
    import { ReactElement } from "react";
    import { IItem } from "utils/types/item";
    export const scriptArgs: (opt: {
        item: DeepReadonly<IItem>;
        childs: ReactElement | null;
        props: React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
            inherit?: {
                style: IItem;
                className: string;
            };
        };
        result: {
            children: ReactElement | null;
        };
    }) => any;
}
declare module "nova/vi/script/vi-if" {
    import { FC, ReactNode } from "react";
    export const IF: FC<{
        condition?: boolean;
        then: ReactNode;
        else?: ReactNode;
    }>;
}
declare module "nova/vi/script/vi-local-auto-render" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { ReactElement } from "react";
    import { IItem } from "utils/types/item";
    import { ViMergedProps } from "nova/vi/lib/types";
    export const ViLocalAutoRender: (opt: {
        name: string;
        value: any;
        effect: (local: any) => void;
        children: ReactElement;
        item: DeepReadonly<IItem>;
        local_value: Record<string, any>;
        local_render: Record<string, () => void>;
        merged: ViMergedProps;
        deps?: any[];
    }) => ReactElement<any, string | import("react").JSXElementConstructor<any>>;
}
declare module "nova/vi/script/vi-local" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { IItem } from "utils/types/item";
    import { ViMergedProps } from "nova/vi/lib/types";
    export const render_mode: unique symbol;
    export const local_name: unique symbol;
    export const createViLocal: (item: DeepReadonly<IItem>, local_value: Record<string, any>, local_render: Record<string, () => void>, merged: ViMergedProps) => (opt: {
        name: string;
        value: any;
        proxy?: any;
        effect: (local: any) => void;
        children: any;
        deps?: any[];
    }) => any;
}
declare module "nova/vi/script/vi-loop" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { IItem } from "utils/types/item";
    import { ViMergedProps } from "nova/vi/lib/types";
    export const createViLoop: (item: DeepReadonly<IItem>, children: any, merged: ViMergedProps) => ({ bind: { list, loop_name: name, key }, }: {
        bind: {
            list: any[];
            loop_name: string;
            key: (arg: {
                item: any;
                index: number;
            }) => any;
        };
    }) => any[] | null;
}
declare module "nova/vi/script/vi-pass-prop" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { IItem } from "utils/types/item";
    import { ViMergedProps } from "nova/vi/lib/types";
    export const createViPassProp: (item: DeepReadonly<IItem>, merged: ViMergedProps) => (this: any, arg: {
        children: any;
    } & Record<string, any>) => import("react").DetailedReactHTMLElement<any, HTMLElement> | null;
}
declare module "nova/vi/vi-script" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import React, { FC, ReactElement } from "react";
    import { IItem } from "utils/types/item";
    import { ViMergedProps } from "nova/vi/lib/types";
    export const ViScript: FC<{
        is_layout: boolean;
        item: DeepReadonly<IItem>;
        childs: ReactElement | null;
        props: React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
            inherit?: {
                style: IItem;
                className: string;
            };
        };
        merged?: ViMergedProps;
        instance_id?: string;
        standalone?: string;
        render: () => void;
    }>;
}
declare module "nova/vi/vi-item" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { DIV_PROPS } from "nova/vi/lib/gen-parts";
    import { DIV_PROPS_OPT, ViMergedProps } from "nova/vi/lib/types";
    export const ViItem: FC<{
        item: DeepReadonly<IItem>;
        is_layout: boolean;
        div_props?: (opt: DIV_PROPS_OPT) => DIV_PROPS;
        merged?: ViMergedProps;
        instance_id?: string;
        standalone?: string;
    }>;
}
declare module "nova/vi/vi-comp" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { DIV_PROPS } from "nova/vi/lib/gen-parts";
    import { DIV_PROPS_OPT, ViMergedProps } from "nova/vi/lib/types";
    export const ViComp: FC<{
        item: DeepReadonly<IItem>;
        is_layout: boolean;
        div_props?: (opt: DIV_PROPS_OPT) => DIV_PROPS;
        merged?: ViMergedProps;
        standalone?: string;
    }>;
}
declare module "nova/vi/vi-render" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { DIV_PROPS } from "nova/vi/lib/gen-parts";
    import { DIV_PROPS_OPT, ViMergedProps } from "nova/vi/lib/types";
    export const ViRender: FC<{
        item: DeepReadonly<IItem>;
        is_layout: boolean;
        div_props?: (opt: DIV_PROPS_OPT) => DIV_PROPS;
        instance_id?: string;
        merged?: ViMergedProps;
        standalone?: string;
        wrapped?: boolean;
    }>;
}
declare module "nova/vi/lib/types" {
    import { EPage } from "nova/ed/logic/types";
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { ViRender } from "nova/vi/vi-render";
    import { ViRef } from "nova/vi/lib/store";
    export type ViPageRoot = {
        id: string;
        root: EPage["content_tree"];
        url: string;
    };
    export type DIV_PROPS_OPT = {
        item: IItem;
        ref: ViRef;
        instance_id?: string;
    };
    export type ViComps = Record<string, IItem>;
    export type ViProp = {
        page: ViPageRoot;
        layout?: ViPageRoot;
        comps: ViComps;
        db: any;
        api: any;
        mode: "desktop" | "mobile";
        wrapper?: ViWrapperType;
        loader: {
            pages: (ids: string[]) => Promise<void>;
            comps: (ids: string[]) => Promise<void>;
        };
        edit_comp_id?: string;
        enable_preload?: boolean;
        vscode_exports: Record<string, any>;
        setRef?: (ref: ViRef) => void;
    };
    export type ViWrapperType = FC<{
        item: IItem;
        is_layout: boolean;
        ViRender: typeof ViRender;
        merged?: ViMergedProps;
        standalone?: string;
        instance_id?: string;
    }>;
    export type ViMergedProps = {
        __internal: Record<string, {
            type: "loop" | "passprop" | "local";
            from_id: string;
        }>;
    } & Record<string, any>;
}
declare module "nova/vi/lib/store" {
    import { DeepReadonly } from "nova/ed/popup/flow/runtime/types";
    import { IItem, IVar } from "utils/types/item";
    import { ViComps, ViPageRoot, ViWrapperType } from "nova/vi/lib/types";
    type ITEM_ID = string;
    type VAR_NAME = string;
    type VAR_ID = string;
    const viRef: {
        init: boolean;
        mode: "mobile" | "desktop";
        loader: {
            comps: (ids: string[]) => {
                new (executor: (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => void): Promise<void>;
                all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
                all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]>; }>;
                race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
                race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
                readonly prototype: Promise<any>;
                reject<T = never>(reason?: any): Promise<T>;
                resolve(): Promise<void>;
                resolve<T>(value: T): Promise<Awaited<T>>;
                resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;
                allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>; }>;
                allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>;
                any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
                any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
                withResolvers<T>(): PromiseWithResolvers<T>;
                withResolvers<T>(): {
                    promise: Promise<T>;
                    resolve: (value?: T | PromiseLike<T>) => void;
                    reject: (reason?: any) => void;
                };
                readonly [Symbol.species]: PromiseConstructor;
            };
        };
        comps: ViComps;
        db: any;
        api: any;
        item_parents: Record<ITEM_ID, ITEM_ID>;
        comp_props: Record<ITEM_ID, Record<VAR_NAME, any>>;
        var_items: Record<VAR_ID, {
            var: IVar<any>;
            item: IItem;
        }>;
        wrapper: null | ViWrapperType;
        instanced: Record<ITEM_ID, any>;
        page: null | ViPageRoot;
        layout: null | ViPageRoot;
        comp: {
            instances: Record<string, IItem>;
            loaded: Set<string>;
        };
        edit_comp_id: string;
        local_render: Record<string, () => void>;
        dev_item_error: Record<string, any>;
        dev_tree_render: Record<string, () => void>;
        resetCompInstance: (comp_id: string) => void;
        resetLocal: () => void;
        vscode_exports: Record<string, any>;
        jsx_pass: Record<string, Record<string, string>>;
    };
    export type ViRef = typeof viRef;
    export const useVi: <Z extends object>(selector: (arg: {
        ref: {
            init: boolean;
            mode: "mobile" | "desktop";
            loader: {
                comps: (ids: string[]) => {
                    new (executor: (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => void): Promise<void>;
                    all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
                    all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]>; }>;
                    race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
                    race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
                    readonly prototype: Promise<any>;
                    reject<T = never>(reason?: any): Promise<T>;
                    resolve(): Promise<void>;
                    resolve<T>(value: T): Promise<Awaited<T>>;
                    resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;
                    allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>; }>;
                    allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>;
                    any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
                    any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
                    withResolvers<T>(): PromiseWithResolvers<T>;
                    withResolvers<T>(): {
                        promise: Promise<T>;
                        resolve: (value?: T | PromiseLike<T>) => void;
                        reject: (reason?: any) => void;
                    };
                    readonly [Symbol.species]: PromiseConstructor;
                };
            };
            comps: ViComps;
            db: any;
            api: any;
            item_parents: Record<ITEM_ID, ITEM_ID>;
            comp_props: Record<ITEM_ID, Record<VAR_NAME, any>>;
            var_items: Record<VAR_ID, {
                var: IVar<any>;
                item: IItem;
            }>;
            wrapper: null | ViWrapperType;
            instanced: Record<ITEM_ID, any>;
            page: null | ViPageRoot;
            layout: null | ViPageRoot;
            comp: {
                instances: Record<string, IItem>;
                loaded: Set<string>;
            };
            edit_comp_id: string;
            local_render: Record<string, () => void>;
            dev_item_error: Record<string, any>;
            dev_tree_render: Record<string, () => void>;
            resetCompInstance: (comp_id: string) => void;
            resetLocal: () => void;
            vscode_exports: Record<string, any>;
            jsx_pass: Record<string, Record<string, string>>;
        };
        state: {};
        action: {
            instantiateComp: (item: DeepReadonly<IItem>) => void;
            resetCompInstance: (comp_id: string) => void;
            syncProp: ({ page, comps, layout, db, api, mode, edit_comp_id, }: {
                page: ViPageRoot;
                layout?: ViPageRoot;
                comps: ViComps;
                db: any;
                api: any;
                mode: "desktop" | "mobile";
                edit_comp_id?: string;
            }) => void;
        };
    }) => Z, instance_name?: string) => Z & {
        update: (fn: (state: {}) => void) => void;
    };
}
declare module "nova/ed/crdt/lib/types" {
    export type JSONPrimitive = string | number | boolean | null;
    export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
    export type JSONObject = {
        [member: string]: JSONValue;
    };
    export interface JSONArray extends Array<JSONValue> {
    }
}
declare module "nova/ed/crdt/lib/util" {
    import * as Y from "yjs";
    import { JSONArray, JSONObject, JSONPrimitive, JSONValue } from "nova/ed/crdt/lib/types";
    export function isJSONPrimitive(v: JSONValue): v is JSONPrimitive;
    export function isJSONArray(v: JSONValue): v is JSONArray;
    export function isJSONObject(v: JSONValue): v is JSONObject;
    export function toYDataType(v: JSONValue): JSONPrimitive | Y.Array<unknown> | Y.Map<unknown> | undefined;
    export function applyJsonArray(dest: Y.Array<unknown>, source: JSONArray): void;
    export function applyJsonObject(dest: Y.Map<unknown>, source: JSONObject): void;
    export function toPlainValue(v: Y.Map<any> | Y.Array<any> | JSONValue): JSONValue;
    export function notImplemented(): void;
}
declare module "nova/ed/crdt/lib/immer-yjs" {
    import { Patch } from "immer";
    import * as Y from "yjs";
    import { JSONArray, JSONObject } from "nova/ed/crdt/lib/types";
    export type Snapshot = JSONObject | JSONArray;
    function defaultApplyPatch(target: Y.Map<any> | Y.Array<any>, patch: Patch): void;
    export type UpdateFn<S extends Snapshot> = (draft: S) => void;
    export type ListenerFn<S extends Snapshot> = (snapshot: S) => void;
    export type UnsubscribeFn = () => void;
    export type Binder<S extends Snapshot> = {
        /**
         * Release the binder.
         */
        unbind: () => void;
        /**
         * Return the latest snapshot.
         */
        get: () => S;
        /**
         * Update the snapshot as well as the corresponding y.js data.
         * Same usage as `produce` from `immer`.
         */
        update: (fn: UpdateFn<S>) => void;
        /**
         * Subscribe to snapshot update, fired when:
         *   1. User called update(fn).
         *   2. y.js source.observeDeep() fired.
         */
        subscribe: (fn: ListenerFn<S>) => UnsubscribeFn;
    };
    export type Options<S extends Snapshot> = {
        /**
         * Customize immer patch application.
         * Should apply patch to the target y.js data.
         * @param target The y.js data to be modified.
         * @param patch The patch that should be applied, please refer to 'immer' patch documentation.
         * @param applyPatch the default behavior to apply patch, call this to handle the normal case.
         */
        applyPatch?: (target: Y.Map<any> | Y.Array<any>, patch: Patch, applyPatch: typeof defaultApplyPatch) => void;
    };
    /**
     * Bind y.js data type.
     * @param source The y.js data type to bind.
     * @param options Change default behavior, can be omitted.
     */
    export function bind<S extends Snapshot>(source: Y.Map<any> | Y.Array<any>, options?: Options<S>): Binder<S>;
}
declare module "nova/ed/crdt/node/flatten-tree" {
    import { NodeModel } from "@minoru/react-dnd-treeview";
    import { IItem } from "utils/types/item";
    import { EComp, PNode } from "nova/ed/logic/types";
    export type FlattenedNodes = ReturnType<typeof flattenTree>;
    export const flattenTree: (items: IItem[], comps: Record<string, EComp>, opt?: {
        visit?: (item: IItem) => void;
        comp_id?: string;
    }, arg?: {
        parent: IItem;
        array: PNode[];
        models: NodeModel<PNode>[];
        map: Record<string, PNode>;
        parent_comp?: {
            prop_name: string;
            is_jsx_root: boolean;
            comp_id: string;
            instance_id: string;
        };
    }) => {
        array: PNode[];
        map: Record<string, PNode>;
        models: NodeModel<PNode>[];
    };
    export const parsePropForJsx: (item: IItem, comps: Record<string, EComp>) => Record<string, IItem>;
    export const findNodeById: (id: string, items: IItem[], comps: Record<string, EComp>, arg?: {
        parent: IItem;
        array: IItem[];
        parent_comp?: {
            prop_name: string;
            comp_id: string;
            instance_id: string;
        };
    }) => null | PNode;
}
declare module "nova/ed/popup/script/code/js/create-model" {
    import type { OnMount } from "@monaco-editor/react";
    export type MonacoEditor = Parameters<OnMount>[0];
    type Monaco = Parameters<OnMount>[1];
    export const monacoCreateModel: ({ monaco, editor, source, filename, activate, onChange, }: {
        editor: MonacoEditor;
        monaco: Monaco;
        source: string;
        filename: string;
        activate?: boolean;
        onChange?: (src: string, event: any) => void;
    }) => import("monaco-editor").editor.ITextModel;
    export const monacoRegisterSource: (monaco: Monaco, source: string, uri: string, onChange?: (src: string, event: any) => void) => import("monaco-editor").editor.ITextModel;
}
declare module "utils/script/parser/traverse" {
    import { jscript } from "utils/script/jscript";
    export function traverse<T = unknown>(ast: ReturnType<Exclude<typeof jscript.parse, null>>["program"], visitors: Record<string, (arg: any) => void>, state?: T): void;
}
declare module "utils/script/jscript" {
    import type { Editor as MonacoEditor } from "@monaco-editor/react";
    import type { parseSync } from "@oxc-parser/wasm";
    import type { formatMessages, transform } from "esbuild-wasm";
    import type estree from "prettier/plugins/estree";
    import type ts from "prettier/plugins/typescript";
    import type Prettier from "prettier/standalone";
    export type FBuild = (entryFileName: string, src: string, files?: Record<string, string>, verbose?: boolean) => Promise<string>;
    export const jscript: {
        MonacoEditor: typeof MonacoEditor | null;
        pending: null | Promise<void>;
        transform: null | typeof transform;
        formatMessages: null | typeof formatMessages;
        parse: null | typeof parseSync;
        prettier: {
            standalone: null | typeof Prettier;
            estree: null | typeof estree;
            ts: null | typeof ts;
            format: (source: string) => Promise<string>;
        };
        getTailwindStyles: null | ((contents: string[]) => Promise<string>);
        loaded: boolean;
        traverse: (code: string, visitors: Record<string, (arg: any) => void>) => void;
        init(): Promise<void>;
    };
    export const cutCode: (code: string, pos: any, arg?: {
        should_start_with: string;
        default: string;
    }) => string;
}
declare module "nova/ed/right/comp/prop-field/fields/prop-list/prop-list-util" {
    import { ReactElement } from "react";
    export type PLObject = {
        type: "object";
        value: Record<string, PLValue>;
    };
    export type PLString = {
        type: "string";
        value: string;
    };
    export type PLCode = {
        type: "code";
        value: string;
    };
    export type PLValue = PLString | PLCode | PLObject;
    export type LSString = {
        type: "string";
        placeholder?: string;
        deletable?: boolean;
        disabled?: boolean;
        label?: string;
        options?: ({
            label: string;
            value: string;
        } | string)[];
    };
    export type LSObject = {
        type: "object";
        object: Record<string, ListStructure>;
    };
    export type ListStructure = LSString | LSObject;
    export type ListLayout = Record<string, (arg: {
        structure: ListStructure;
        value: any;
        update: (key: string, value: any) => void;
    }) => ReactElement>;
    export const getPropStructureByPath: (structure: ListStructure, path: (string | number)[]) => ListStructure | undefined;
    export const parsePLValue: (source: string) => PLValue[];
    export const plStringifySingle: (value: PLValue, depth?: number) => string;
    export const getPropValueByPath: (value: PLValue[], path: (string | number)[]) => PLValue | null;
    export const createListItem: (structures: ListStructure) => PLValue;
}
declare module "nova/ed/popup/script/code/js/generate-imports" {
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    import { MergeProp } from "nova/ed/popup/script/code/js/migrate-code";
    export const generateImports: (model: ScriptModel, models: Record<string, ScriptModel>) => string;
    export const mergeParentVars: (model: ScriptModel, script_models: Record<string, ScriptModel>, debug?: boolean) => MergeProp;
}
declare module "nova/ed/popup/script/code/js/generate-passprop" {
    import { SingleExportVar } from "nova/ed/popup/script/code/js/parse-item-types";
    export const generatePassPropAndLoop: (model: {
        exports: Record<string, SingleExportVar>;
    }) => string;
}
declare module "nova/ed/popup/script/code/js/migrate-code" {
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    type PROP_NAME = string;
    type ITEM_ID = string;
    export type JSX_PASS = Record<PROP_NAME, Record<ITEM_ID, Record<string, {
        id: string;
        type: string;
    }>>>;
    export const extractRegion: (code: string) => string[];
    export const removeRegion: (code: string) => string;
    export const migrateCode: (model: ScriptModel, models: Record<string, ScriptModel>, comp_id?: string) => string;
    export type MergeProp = Record<string, {
        id: string;
        type: string;
    }>;
    export const generateRegion: (model: ScriptModel, models: Record<string, ScriptModel>, opt?: {
        comp_id?: string;
        debug?: boolean;
        inject_start?: string;
        inject_end?: string;
    }) => string;
}
declare module "nova/ed/popup/script/code/js/parse-item-local" {
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    import { SingleExportVar } from "nova/ed/popup/script/code/js/parse-item-types";
    import type { JSXElement, JSXElementName } from "@oxc-parser/wasm";
    export const parseItemLocal: ({ name, node, model, replacements, exports, }: {
        name: JSXElementName;
        node: JSXElement;
        model: ScriptModel;
        replacements: Array<{
            start: number;
            end: number;
            replacement: string;
        }>;
        exports: Record<string, SingleExportVar>;
    }) => void;
}
declare module "nova/ed/popup/script/code/js/parse-item-passprop" {
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    import { SingleExportVar } from "nova/ed/popup/script/code/js/parse-item-types";
    import type { JSXElement, JSXElementName } from "@oxc-parser/wasm";
    export const parseItemPassPropAndLoop: ({ name, node, model, exports, map, }: {
        name: JSXElementName;
        node: JSXElement;
        model: ScriptModel;
        exports: Record<string, SingleExportVar>;
        map?: {
            value?: string;
            item: string;
            idx?: string;
        };
    }) => void;
}
declare module "nova/ed/popup/script/code/js/replace-string" {
    export function replaceString(originalText: string, replacements: Array<{
        start: number;
        end: number;
        replacement: string;
    }>): string;
}
declare module "nova/ed/popup/script/code/js/parse-item-code" {
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    export const parseItemCode: (model: ScriptModel, visitors: any) => void;
}
declare module "nova/ed/crdt/node/load-child-comp" {
    import { EBaseComp, EComp } from "nova/ed/logic/types";
    import { IItem } from "utils/types/item";
    import { PG } from "nova/ed/logic/ed-global";
    export const loadPendingComponent: (p: PG) => Promise<void>;
    export const loopChildComponent: (item: IItem, comps: Record<string, EComp>, fn: (opt: {
        item: IItem;
        stopLoop: () => void;
        parent?: IItem;
    }) => Promise<void>, parent?: IItem) => Promise<void>;
    export const decorateEComp: (p: PG, comp: EBaseComp) => EComp;
}
declare module "nova/ed/crdt/node/var-items" {
    import { IItem, IVar } from "utils/types/item";
    type VAR_ID = string;
    export type TreeVarItems = Record<VAR_ID, {
        item: Readonly<IItem>;
        var: Readonly<IVar<any>>;
        item_id: string;
    }>;
}
declare module "nova/ed/crdt/node/load-script-models" {
    import { EComp } from "nova/ed/logic/types";
    import { monacoCreateModel } from "nova/ed/popup/script/code/js/create-model";
    import { SingleExportVar } from "nova/ed/popup/script/code/js/parse-item-types";
    import { ViRef } from "nova/vi/lib/store";
    import { FlattenedNodes } from "nova/ed/crdt/node/flatten-tree";
    import { TreeVarItems } from "nova/ed/crdt/node/var-items";
    const source_sym: unique symbol;
    export const loadScriptModels: (arg: {
        nodes: FlattenedNodes;
        p: {
            comp: {
                loaded: Record<string, EComp>;
                pending: Set<string>;
            };
            viref: ViRef;
        };
        var_items: TreeVarItems;
        script_models: Record<string, ScriptModel>;
        resume_pending?: Set<string>;
        comp_id?: string;
    }) => Promise<{
        pending_items: Set<string>;
        jsx_exports_changed: Record<string, {
            hash: string;
            exports: Record<string, SingleExportVar & {
                item_id: string;
            }>;
        }>;
    }>;
    export const newScriptModel: ({ model_id, comp_def, value, title, path_names, prop_name, source_hash, path_ids, jsx_pass, }: {
        model_id: string;
        comp_def?: EComp;
        value: string;
        title: string;
        path_names: string[];
        source_hash: string;
        prop_name?: string;
        path_ids: string[];
        jsx_pass?: ScriptModel["jsx_pass"];
    }) => ScriptModel;
    export type ScriptModel = {
        source: string;
        source_hash: string;
        name: string;
        id: string;
        path_names: string[];
        jsx_pass?: {
            hash: string;
            exports: Record<string, SingleExportVar & {
                item_id: string;
            }>;
        };
        prop_name?: string;
        prop_names?: string[];
        prop_value?: string;
        path_ids: string[];
        comp_def?: EComp;
        title: string;
        local: {
            name: string;
            value: string;
            auto_render: boolean;
        };
        loop: {
            name: string;
            list: string;
        };
        extracted_content: string;
        model?: ReturnType<typeof monacoCreateModel> & {
            _ignoreChanges?: any;
        };
        [source_sym]: string;
        ready: boolean;
        exports: Record<string, SingleExportVar>;
        already_migrated: boolean;
    };
}
declare module "nova/ed/crdt/load-comp-tree" {
    import { NodeModel } from "@minoru/react-dnd-treeview";
    import { PG } from "nova/ed/logic/ed-global";
    import { EBaseComp, EComp, PNode, SyncUndoItem } from "nova/ed/logic/types";
    import { createClient } from "utils/sync/client";
    import { IItem } from "utils/types/item";
    import { ViRef } from "nova/vi/lib/store";
    import { flattenTree } from "nova/ed/crdt/node/flatten-tree";
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    import { TreeVarItems } from "nova/ed/crdt/node/var-items";
    export type CompTree = ReturnType<typeof internalLoadCompTree>;
    export const activateComp: (p: PG, comp_id: string) => Promise<void>;
    export const loadCompTree: (opt: {
        p: {
            comp: {
                loaded: Record<string, EComp>;
                pending: Set<string>;
            };
            render: () => void;
            viref: ViRef;
            sync: undefined | null | ReturnType<typeof createClient>;
        };
        id: string;
        on_update?: (comp: EBaseComp["content_tree"]) => void;
        on_child_component?: (item: IItem) => void;
        activate?: boolean;
    }) => Promise<{
        id: string;
        nodes: {
            models: NodeModel<PNode>[];
            map: Record<string, PNode>;
            array: PNode[];
        };
        readonly snapshot: IItem;
        history: () => Promise<{
            undo: SyncUndoItem[];
            redo: SyncUndoItem[];
            history: Record<number, string>;
            ts: number;
        }>;
        undo: (count?: number) => void;
        redo: (count?: number) => void;
        listen: (fn: () => void) => import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        script_models: Record<string, ScriptModel>;
        var_items: TreeVarItems;
        reloadScriptModels(): Promise<void>;
        before_update: null | ((do_update: () => void) => void);
        update(action_name: string, fn: (opt: {
            tree: EBaseComp["content_tree"];
            flatten(): ReturnType<typeof flattenTree>;
            findNode: (id: string) => null | PNode;
            findParent: (id: string) => null | PNode;
        }) => void, done?: (opt: {
            tree: EBaseComp["content_tree"];
            findNode: (id: string) => null | PNode;
        }) => void): void;
        subscribe(fn: any): import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        watch<T>(fn?: (val: EBaseComp["content_tree"]) => T): T | undefined;
        destroy: () => Promise<void>;
    }>;
    export const internalLoadCompTree: (opt: Parameters<typeof loadCompTree>[0], done: (res: any) => void) => {
        id: string;
        nodes: {
            models: NodeModel<PNode>[];
            map: Record<string, PNode>;
            array: PNode[];
        };
        readonly snapshot: IItem;
        history: () => Promise<{
            undo: SyncUndoItem[];
            redo: SyncUndoItem[];
            history: Record<number, string>;
            ts: number;
        }>;
        undo: (count?: number) => void;
        redo: (count?: number) => void;
        listen: (fn: () => void) => import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        script_models: Record<string, ScriptModel>;
        var_items: TreeVarItems;
        reloadScriptModels(): Promise<void>;
        before_update: null | ((do_update: () => void) => void);
        update(action_name: string, fn: (opt: {
            tree: EBaseComp["content_tree"];
            flatten(): ReturnType<typeof flattenTree>;
            findNode: (id: string) => null | PNode;
            findParent: (id: string) => null | PNode;
        }) => void, done?: (opt: {
            tree: EBaseComp["content_tree"];
            findNode: (id: string) => null | PNode;
        }) => void): void;
        subscribe(fn: any): import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        watch<T>(fn?: (val: EBaseComp["content_tree"]) => T): T | undefined;
        destroy: () => Promise<void>;
    };
}
declare module "nova/ed/tree/parts/scroll-tree" {
    export const scrollTreeActiveItem: () => void;
}
declare module "nova/ed/tree/parts/use-indent" {
    import { PG } from "nova/ed/logic/ed-global";
    export const useTreeIndent: (p: PG) => void;
    export const indentTree: (p: PG) => void;
}
declare module "nova/ed/logic/active" {
    import { CompTree } from "nova/ed/crdt/load-comp-tree";
    import { PG } from "nova/ed/logic/ed-global";
    export const getActiveTree: (p: PG) => {
        nodes: {
            models: import("@minoru/react-dnd-treeview").NodeModel<import("nova/ed/logic/types").PNode>[];
            array: import("nova/ed/logic/types").PNode[];
            map: Record<string, import("nova/ed/logic/types").PNode>;
        };
        readonly snapshot: import("nova/ed/logic/types").EPageContentTree;
        history: () => Promise<{
            undo: import("nova/ed/logic/types").SyncUndoItem[];
            redo: import("nova/ed/logic/types").SyncUndoItem[];
            history: Record<number, string>;
            ts: number;
        }>;
        undo: (count?: number) => void;
        redo: (count?: number) => void;
        listen: (fn: () => void) => import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        script_models: Record<string, import("nova/ed/crdt/node/load-script-models").ScriptModel>;
        var_items: import("nova/ed/crdt/node/var-items").TreeVarItems;
        reloadScriptModels(): Promise<void>;
        before_update: null | ((do_update: () => void) => void);
        update(action_name: string, fn: (opt: {
            tree: import("nova/ed/logic/types").EPage["content_tree"];
            findNode: (id: string) => null | import("nova/ed/logic/types").PNode;
            flatten(): ReturnType<typeof import("nova/ed/crdt/node/flatten-tree").flattenTree>;
            findParent: (id: string) => null | import("nova/ed/logic/types").PNode;
        }) => void, done?: (opt: {
            tree: import("nova/ed/logic/types").EPage["content_tree"];
            findNode: (id: string) => null | import("nova/ed/logic/types").PNode;
        }) => void): void;
        subscribe(fn: any): import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        watch<T>(fn?: (val: import("nova/ed/logic/types").EPage["content_tree"]) => T): T | undefined;
        destroy: () => Promise<void>;
    } | {
        id: string;
        nodes: {
            models: import("@minoru/react-dnd-treeview").NodeModel<import("nova/ed/logic/types").PNode>[];
            map: Record<string, import("nova/ed/logic/types").PNode>;
            array: import("nova/ed/logic/types").PNode[];
        };
        readonly snapshot: import("utils/types/item").IItem;
        history: () => Promise<{
            undo: import("nova/ed/logic/types").SyncUndoItem[];
            redo: import("nova/ed/logic/types").SyncUndoItem[];
            history: Record<number, string>;
            ts: number;
        }>;
        undo: (count?: number) => void;
        redo: (count?: number) => void;
        listen: (fn: () => void) => import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        script_models: Record<string, import("nova/ed/crdt/node/load-script-models").ScriptModel>;
        var_items: import("nova/ed/crdt/node/var-items").TreeVarItems;
        reloadScriptModels(): Promise<void>;
        before_update: null | ((do_update: () => void) => void);
        update(action_name: string, fn: (opt: {
            tree: import("nova/ed/logic/types").EBaseComp["content_tree"];
            flatten(): ReturnType<typeof import("nova/ed/crdt/node/flatten-tree").flattenTree>;
            findNode: (id: string) => null | import("nova/ed/logic/types").PNode;
            findParent: (id: string) => null | import("nova/ed/logic/types").PNode;
        }) => void, done?: (opt: {
            tree: import("nova/ed/logic/types").EBaseComp["content_tree"];
            findNode: (id: string) => null | import("nova/ed/logic/types").PNode;
        }) => void): void;
        subscribe(fn: any): import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        watch<T>(fn?: (val: import("nova/ed/logic/types").EBaseComp["content_tree"]) => T): T | undefined;
        destroy: () => Promise<void>;
    };
    export type ActiveTree = ReturnType<typeof getActiveTree>;
    export const activateItem: (p: PG, id: string) => void;
    export const active: {
        item_id: string;
        comp_id: string;
        comp: null | CompTree;
        hover: {
            id: string;
            tree: boolean;
        };
        script_nav: {
            list: {
                item_id: string;
                comp_id?: string;
                instance?: {
                    item_id: string;
                    comp_id?: string;
                };
            }[];
            idx: number;
        };
        instance: {
            comp_id: string;
            item_id: string;
        };
    };
}
declare module "nova/prod/root/window" {
    import { FC } from "react";
    import { EPage } from "nova/ed/logic/types";
    import { IItem } from "utils/types/item";
    export const w: {
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
        preload: (urls: string[], opt: {
            on_load: (pages: {
                id: string;
                url: string;
                content_tree: EPage["content_tree"];
            }[], walk: (root: {
                content_tree: EPage["content_tree"];
            }[], visit: (item: IItem) => void | Promise<void>) => void) => void;
        }) => Promise<void>;
    };
}
declare module "nova/vi/lib/init-vi" {
    import { ViProp } from "nova/vi/lib/types";
    export const viInit: ({ loader, enablePreload, }: {
        loader: ViProp["loader"];
        enablePreload: boolean;
    }) => void;
}
declare module "nova/vi/vi-page" {
    import { FC } from "react";
    import { ViComps, ViPageRoot } from "nova/vi/lib/types";
    export const ViPage: FC<{
        init?: {
            comps: ViComps;
            page: ViPageRoot;
            name: string;
            exports: any;
        };
    }>;
}
declare module "nova/vi/vi-root" {
    import { FC } from "react";
    import { ViProp } from "nova/vi/lib/types";
    export const ViRoot: FC<ViProp>;
}
declare module "utils/ui/context-menu" {
    import { ReactNode } from "react";
    import "./context-menu.css";
    export const MenuItem: import("react").ForwardRefExoticComponent<import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
        label: ReactNode;
        hotKey?: ReactNode;
        disabled?: boolean;
    } & import("react").RefAttributes<HTMLButtonElement>>;
    interface Props {
        label?: string;
        nested?: boolean;
        mouseEvent: React.MouseEvent<HTMLElement, MouseEvent>;
        onClose: () => void;
    }
    export const Menu: import("react").ForwardRefExoticComponent<Omit<Props & Omit<import("react").HTMLProps<HTMLButtonElement>, "contextMenu">, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
}
declare module "nova/ed/tree/action/detach" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionDetach: (p: PG, item: IItem) => void;
}
declare module "nova/ed/tree/action/new-comp" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionNewComp: (p: PG, item: IItem, e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
declare module "nova/ed/tree/action/hide" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionHide: (p: PG, item: IItem, mode?: "toggle" | "switch") => void;
}
declare module "nova/ed/tree/action/rename" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionRename: (p: PG, item: IItem) => void;
}
declare module "nova/ed/tree/action/delete" {
    import { IItem } from "utils/types/item";
    import { PG } from "nova/ed/logic/ed-global";
    export const edActionDelete: (p: PG, item: IItem) => Promise<void>;
    export const edActionDeleteById: (p: PG, id: string) => Promise<void>;
}
declare module "nova/ed/tree/action/cut" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionCut: (p: PG, item: IItem) => Promise<void>;
}
declare module "nova/ed/logic/fill-id" {
    import { IItem } from "utils/types/item";
    export const fillID: (object: IItem, modify?: (obj: IItem) => boolean, currentDepth?: number) => IItem;
}
declare module "nova/ed/tree/action/clone" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionClone: (p: PG, item: IItem) => void;
}
declare module "nova/ed/tree/action/copy" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionCopy: (p: PG, item: IItem) => Promise<void>;
}
declare module "nova/ed/tree/action/paste" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionPaste: (p: PG, item: IItem) => Promise<void>;
}
declare module "nova/ed/tree/action/wrap" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionWrap: (p: PG, item: IItem) => void;
    export const edActionWrapInComp: (p: PG, item: IItem) => void;
}
declare module "nova/ed/tree/action/unwrap" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionUnwrap: (p: PG, item: IItem) => void;
}
declare module "nova/ed/tree/action/add" {
    import { PG } from "nova/ed/logic/ed-global";
    import { IItem } from "utils/types/item";
    export const edActionAdd: (p: PG, item?: IItem) => Promise<void>;
    export const animalNames: string[];
}
declare module "nova/ed/tree/parts/ctx-menu" {
    import { NodeModel } from "@minoru/react-dnd-treeview";
    import { PNode } from "nova/ed/logic/types";
    export const EdTreeCtxMenu: ({ raw: raw, event, onClose, }: {
        event: React.MouseEvent<HTMLDivElement, MouseEvent>;
        raw?: NodeModel<PNode>;
        onClose: () => void;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/cprasi/lib/prasi-db/db-typings" {
    import type { PrismaClient as PrasiDBClient, Prisma as PrasiDB } from "prasi-prisma";
    export type PrasiDBEditor = PrasiDBClient & {
        _batch: {
            update: <T extends PrasiDB.ModelName>(batch: {
                table: T;
                data: Exclude<Parameters<PrasiDBClient[T]["update"]>[0], undefined>["data"];
                where: Exclude<Parameters<PrasiDBClient[T]["findMany"]>[0], undefined>["where"];
            }[]) => Promise<void>;
            upsert: <T extends PrasiDB.ModelName>(arg: {
                table: T;
                where: Exclude<Parameters<PrasiDBClient[T]["findMany"]>[0], undefined>["where"];
                data: Exclude<Parameters<PrasiDBClient[T]["create"]>[0], undefined>["data"][];
                mode?: "field" | "relation";
            }) => Promise<void>;
        };
        _schema: {
            tables: () => Promise<PrasiDB.ModelName[]>;
            columns: (table: PrasiDB.ModelName) => Promise<Record<string, {
                is_pk: boolean;
                type: string;
                optional: boolean;
                db_type: string;
                default?: any;
            }>>;
            rels: (table: PrasiDB.ModelName) => Promise<Record<string, {
                type: "has-many" | "has-one";
                to: {
                    table: PrasiDB.ModelName;
                    fields: string[];
                };
                from: {
                    table: PrasiDB.ModelName;
                    fields: string[];
                };
            }>>;
        };
    };
}
declare module "nova/ed/cprasi/lib/prasi-site" {
    import { ESite } from "nova/ed/logic/types";
    export const prasi_site: ESite;
}
declare module "nova/ed/cprasi/lib/prasi" {
    import { PrasiDBEditor } from "nova/ed/cprasi/lib/prasi-db/db-typings";
    export type { DeployTarget, SiteSettings } from "nova/ed/cprasi/lib/typings";
    export const prasi: {
        site: import("nova/ed/logic/types").ESite;
        db: PrasiDBEditor;
    };
}
declare module "nova/ed/ed-vi-root" {
    import { PG } from "nova/ed/logic/ed-global";
    export const EdViRoot: import("react").MemoExoticComponent<() => import("react/jsx-runtime").JSX.Element>;
    export const applyVscTypings: (p: PG, arg: {
        vars: Record<string, string>;
        source: string;
    }) => void;
}
declare module "utils/sync/client" {
    import { PG } from "nova/ed/logic/ed-global";
    import { EBaseComp, EPage } from "nova/ed/logic/types";
    export const clientStartSync: (arg: {
        p: PG;
        user_id: string;
        site_id: string;
        page_id?: string;
        siteLoaded: (sync: ReturnType<typeof createClient>) => void;
    }) => void;
    export const createClient: (ws: WebSocket, p: any, conn_id: string) => {
        conn_id: string;
        ws: WebSocket;
        ping: null | Timer;
        comp: {
            undo: (comp_id: string, count: number) => void;
            redo: (comp_id: string, count: number) => void;
            load: (ids: string[]) => Promise<Record<string, EBaseComp>>;
            pending_action: (comp_id: string, action_name: string) => void;
        };
        page: {
            undo: (page_id: string, count: number) => void;
            redo: (page_id: string, count: number) => void;
            load: (id: string) => Promise<Omit<EPage, "content_tree">>;
            pending_action: (page_id: string, action_name: string) => void;
        };
    };
}
declare module "nova/ed/crdt/load-page-tree" {
    import { NodeModel } from "@minoru/react-dnd-treeview";
    import { createClient } from "utils/sync/client";
    import { IItem } from "utils/types/item";
    import { EComp, EPage, EPageContentTree, PNode, SyncUndoItem } from "nova/ed/logic/types";
    import { flattenTree } from "nova/ed/crdt/node/flatten-tree";
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    import { TreeVarItems } from "nova/ed/crdt/node/var-items";
    import { ViRef } from "nova/vi/lib/store";
    export type PageTree = ReturnType<typeof loadPageTree>;
    type ITEM_ID = string;
    export const loadPageTree: (p: {
        comp: {
            loaded: Record<string, EComp>;
            pending: Set<string>;
        };
        ui: {
            page: {
                saved: boolean;
                saving: any;
            };
            topbar: {
                render: () => void;
            };
        };
        viref: ViRef;
        render: () => void;
    }, sync: ReturnType<typeof createClient>, page_id: string, arg?: {
        loaded: (content_tree: EPageContentTree) => void | Promise<void>;
        on_component?: (item: IItem) => void;
    }) => {
        nodes: {
            models: NodeModel<PNode>[];
            array: PNode[];
            map: Record<string, PNode>;
        };
        readonly snapshot: EPageContentTree;
        history: () => Promise<{
            undo: SyncUndoItem[];
            redo: SyncUndoItem[];
            history: Record<number, string>;
            ts: number;
        }>;
        undo: (count?: number) => void;
        redo: (count?: number) => void;
        listen: (fn: () => void) => import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        script_models: Record<ITEM_ID, ScriptModel>;
        var_items: TreeVarItems;
        reloadScriptModels(): Promise<void>;
        before_update: null | ((do_update: () => void) => void);
        update(action_name: string, fn: (opt: {
            tree: EPage["content_tree"];
            findNode: (id: string) => null | PNode;
            flatten(): ReturnType<typeof flattenTree>;
            findParent: (id: string) => null | PNode;
        }) => void, done?: (opt: {
            tree: EPage["content_tree"];
            findNode: (id: string) => null | PNode;
        }) => void): void;
        subscribe(fn: any): import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        watch<T>(fn?: (val: EPage["content_tree"]) => T): T | undefined;
        destroy: () => Promise<void>;
    };
}
declare module "nova/ed/tree/parts/node/node-indent" {
    import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
    import { PNode } from "nova/ed/logic/types";
    export const DEPTH_WIDTH = 5;
    export const EdTreeNodeIndent: ({ raw, render_params, }: {
        raw: NodeModel<PNode>;
        render_params: RenderParams;
    }) => import("react/jsx-runtime").JSX.Element;
    export const ChevronRight: ({ size: size }: {
        size?: number;
    }) => import("react/jsx-runtime").JSX.Element;
    export const ChevronDown: () => import("react/jsx-runtime").JSX.Element;
    export const ComponentIcon: () => import("react/jsx-runtime").JSX.Element;
    export const ItemIcon: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/tree/parts/node/node-name" {
    import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
    import { FC } from "react";
    import { PNode } from "nova/ed/logic/types";
    export const formatItemName: (name: string) => string;
    export const EdTreeNodeName: FC<{
        raw: NodeModel<PNode>;
        render_params: RenderParams;
        is_active: boolean;
    }>;
}
declare module "nova/ed/popup/comp/comp-picker/rpn-component" {
    import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
    import { FC } from "react";
    import { CompPickerNode } from "nova/ed/popup/comp/comp-picker/render-picker-node";
    export const RPNComponent: FC<{
        node: NodeModel<CompPickerNode>;
        prm: RenderParams;
        checked: boolean;
        onCheck: (item_id: string) => void;
        onRightClick: (arg: {
            event: React.MouseEvent<HTMLElement, MouseEvent>;
            comp_id: string;
        }) => void;
    }>;
}
declare module "nova/ed/popup/comp/comp-picker/to-nodes" {
    import { PG } from "nova/ed/logic/ed-global";
    export const compPickerToNodes: (p: PG) => void;
}
declare module "nova/ed/popup/comp/comp-picker/rpn-folder" {
    import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
    import { FC } from "react";
    import { CompPickerNode } from "nova/ed/popup/comp/comp-picker/render-picker-node";
    export const RPNFolder: FC<{
        node: NodeModel<CompPickerNode>;
        prm: RenderParams;
        len: number;
    }>;
}
declare module "nova/ed/popup/comp/comp-picker/comp-edit-info" {
    import { FC } from "react";
    import { CompPickerNode } from "nova/ed/popup/comp/comp-picker/render-picker-node";
    import { NodeModel } from "@minoru/react-dnd-treeview";
    export const EdCompEditInfo: FC<{
        node: NodeModel<CompPickerNode>;
        close: () => void;
    }>;
}
declare module "nova/ed/popup/comp/comp-picker/render-picker-node" {
    import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
    export type CompPickerNode = {
        type: "folder" | "comp";
        name: string;
        id: string;
        idx: string;
        render?: () => void;
    };
    export const compRenderPickerNode: (node: NodeModel<CompPickerNode>, prm: RenderParams, checked: boolean, onCheck: (item_id: string) => void, ctx_menu: {
        edit_id: string;
        closeEdit: () => void;
        activate: (arg: {
            event: React.MouseEvent<HTMLElement, MouseEvent>;
            comp_id: string;
        }) => void;
    }, len?: number) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/logic/ed-global" {
    import { NodeModel, TreeMethods } from "@minoru/react-dnd-treeview";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    import { defineScriptEdit } from "nova/ed/popup/script/parts/do-edit";
    import { createClient } from "utils/sync/client";
    import { ViRef } from "nova/vi/lib/store";
    import { PageTree } from "nova/ed/crdt/load-page-tree";
    import { CompPickerNode } from "nova/ed/popup/comp/comp-picker/render-picker-node";
    import { EBaseComp, EComp, EPage, ESite } from "nova/ed/logic/types";
    import { MonacoEditor } from "utils/script/typings";
    import { IItem } from "utils/types/item";
    import { Monaco } from "nova/ed/popup/script/code/js/enable-jsx";
    export const EDGlobal: {
        mode: "desktop" | "mobile";
        user: {
            id: string;
            username: string;
            client_id: string;
        };
        status: "init" | "load-site" | "reload" | "site-not-found" | "page-not-found" | "ready" | "no-site";
        site: null | ESite;
        page: {
            cur: EPage;
            tree: PageTree;
            pending_instances: Record<string, IItem>;
        };
        viref: ViRef;
        comp: {
            pending: Set<string>;
            loaded: Record<string, EComp>;
        };
        script: {
            ignore_changes: boolean;
            editor: null | MonacoEditor;
            monaco: null | Monaco;
            snippet_pasted: boolean;
            do_edit: ReturnType<typeof defineScriptEdit>;
            flow: {
                current: null | RPFlow;
                should_relayout: boolean;
            };
            monaco_selection: any;
            search: {
                text: string;
            };
            typings_vscode: string;
            typings_entry: string;
        };
        nav: {
            navigating: boolean;
            cursor: number;
            history: {
                comp_id?: string;
                item_id: string;
                ui?: any;
            }[];
        };
        ui: {
            site: {
                loading_status: string;
                build_log: string[];
            };
            topbar: {
                render: () => void;
                mode: "page" | "bundle" | "deploy";
                reconnected: boolean;
            };
            page: {
                ids: Set<string>;
                ruler: boolean;
                loaded: boolean;
                saving: boolean;
                saved: boolean;
            };
            panel: {
                left: boolean;
                right: boolean;
            };
            editor: {
                hover: string;
                render(): void;
            };
            zoom: any;
            comp: {
                editable: boolean;
                creating_id: string;
                loading_id: string;
                last_edit_ids: string[];
                re_eval_item_ids: Set<string>;
                prop: {
                    active: string;
                    context_name: string;
                    context_event: null | React.MouseEvent<HTMLElement, MouseEvent>;
                    readonly expanded: any;
                    render_prop_editor: (force?: boolean) => void;
                };
            };
            tree: {
                rename_id: string;
                open_all: boolean;
                ref: null | TreeMethods;
                prevent_indent: boolean;
                prevent_tooltip: boolean;
                tooltip: {
                    open: string;
                    open_timeout: any;
                };
                comp: {
                    master_prop: string;
                    active: string;
                    tab: string;
                };
                expanded: Record<string, string[]>;
                search: {
                    value: string;
                    mode: {
                        JS: boolean;
                        HTML: boolean;
                        CSS: boolean;
                        Name: boolean;
                    };
                    ref: null | HTMLInputElement;
                };
            };
            left: {
                mode: "tree" | "history";
            };
            right: {
                tab: "style" | "vars" | "events";
            };
            popup: {
                events: {
                    open: "" | "content" | "loop";
                };
                vars: {
                    id: string;
                };
                site: null | ((id_site: string) => any);
                site_form: null | {
                    id: string;
                    group_id: string;
                    name?: string;
                    domain?: string;
                    responsive?: string;
                };
                script: {
                    open: boolean;
                    paned: boolean;
                    mode: "" | "prop" | "comp" | "js" | "css" | "html";
                    type: "item" | "prop-master" | "prop-instance" | "comp-types";
                    on_close: () => void;
                    typings: {
                        status: "ok" | "loading" | "error";
                        err_msg: string;
                    };
                    wb_render: () => void;
                    ref: any;
                    side_open: boolean;
                };
                comp_group: {
                    mouse_event: null | React.MouseEvent<HTMLElement, MouseEvent>;
                    on_pick(group_id: string): void;
                    on_close(group_id: string): void;
                };
                comp: {
                    search: {
                        value: string;
                    };
                    tab: string;
                    on_pick: null | ((comp_id: string) => void);
                    render: () => void;
                    picker_ref: null | HTMLDivElement;
                    status: "loading" | "ready" | "processing";
                    reload: () => Promise<void>;
                    should_import: boolean;
                    data: {
                        comps: (Omit<EBaseComp, "content_tree"> & {
                            name: string;
                        })[];
                        groups: {
                            id: string;
                            name: string;
                        }[];
                        nodes: NodeModel<CompPickerNode>[];
                    };
                };
            };
            layout: {
                left: number;
            };
        };
        sync: undefined | null | ReturnType<typeof createClient>;
    };
    export type PG = typeof EDGlobal & {
        render: () => void;
    };
}
declare module "utils/ui/is-localhost" {
    export const isLocalhost: () => string | undefined;
}
declare module "base/page/all" {
    const _default_3: {
        url: string;
        component: import("react").FC<any>;
    };
    export default _default_3;
}
declare module "utils/ui/modal" {
    import * as React from "react";
    interface ModalOptions {
        initialOpen?: boolean;
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        fade?: boolean;
    }
    export function useModal({ initialOpen, open: controlledOpen, onOpenChange: setControlledOpen, }: ModalOptions): {
        labelId: string | undefined;
        descriptionId: string | undefined;
        setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
        setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
        placement: import("@floating-ui/utils").Placement;
        strategy: import("@floating-ui/utils").Strategy;
        middlewareData: import("@floating-ui/core").MiddlewareData;
        x: number;
        y: number;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: React.CSSProperties;
        refs: {
            reference: React.MutableRefObject<import("@floating-ui/react-dom").ReferenceType | null>;
            floating: React.MutableRefObject<HTMLElement | null>;
            setReference: (node: import("@floating-ui/react-dom").ReferenceType | null) => void;
            setFloating: (node: HTMLElement | null) => void;
        } & import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: {
            reference: import("@floating-ui/react-dom").ReferenceType | null;
            floating: HTMLElement | null;
        } & import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        context: {
            update: () => void;
            x: number;
            y: number;
            placement: import("@floating-ui/utils").Placement;
            strategy: import("@floating-ui/utils").Strategy;
            middlewareData: import("@floating-ui/core").MiddlewareData;
            isPositioned: boolean;
            floatingStyles: React.CSSProperties;
            open: boolean;
            onOpenChange: (open: boolean, event?: Event, reason?: import("@floating-ui/react").OpenChangeReason) => void;
            events: import("@floating-ui/react").FloatingEvents;
            dataRef: React.MutableRefObject<import("@floating-ui/react").ContextData>;
            nodeId: string | undefined;
            floatingId: string;
            refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
            elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        };
        getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
        getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
        getItemProps: (userProps?: Omit<React.HTMLProps<HTMLElement>, "selected" | "active"> & {
            active?: boolean;
            selected?: boolean;
        }) => Record<string, unknown>;
        open: boolean;
        setOpen: (open: boolean) => void;
    };
    export const useModalContext: () => {
        labelId: string | undefined;
        descriptionId: string | undefined;
        setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
        setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
        placement: import("@floating-ui/utils").Placement;
        strategy: import("@floating-ui/utils").Strategy;
        middlewareData: import("@floating-ui/core").MiddlewareData;
        x: number;
        y: number;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: React.CSSProperties;
        refs: {
            reference: React.MutableRefObject<import("@floating-ui/react-dom").ReferenceType | null>;
            floating: React.MutableRefObject<HTMLElement | null>;
            setReference: (node: import("@floating-ui/react-dom").ReferenceType | null) => void;
            setFloating: (node: HTMLElement | null) => void;
        } & import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: {
            reference: import("@floating-ui/react-dom").ReferenceType | null;
            floating: HTMLElement | null;
        } & import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        context: {
            update: () => void;
            x: number;
            y: number;
            placement: import("@floating-ui/utils").Placement;
            strategy: import("@floating-ui/utils").Strategy;
            middlewareData: import("@floating-ui/core").MiddlewareData;
            isPositioned: boolean;
            floatingStyles: React.CSSProperties;
            open: boolean;
            onOpenChange: (open: boolean, event?: Event, reason?: import("@floating-ui/react").OpenChangeReason) => void;
            events: import("@floating-ui/react").FloatingEvents;
            dataRef: React.MutableRefObject<import("@floating-ui/react").ContextData>;
            nodeId: string | undefined;
            floatingId: string;
            refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
            elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
        };
        getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
        getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
        getItemProps: (userProps?: Omit<React.HTMLProps<HTMLElement>, "selected" | "active"> & {
            active?: boolean;
            selected?: boolean;
        }) => Record<string, unknown>;
        open: boolean;
        setOpen: (open: boolean) => void;
    } & {
        setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
        setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    };
    export function Modal({ children, ...options }: {
        children: React.ReactNode;
    } & ModalOptions): import("react/jsx-runtime").JSX.Element;
    interface ModalTriggerProps {
        children: React.ReactNode;
        asChild?: boolean;
    }
    export const ModalTrigger: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLElement> & ModalTriggerProps, "ref"> & React.RefAttributes<HTMLElement>>;
    export const ModalContent: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLDivElement> & {
        fade?: boolean;
    }, "ref"> & React.RefAttributes<HTMLDivElement>>;
    export const ModalHeading: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
    export const ModalDescription: React.ForwardRefExoticComponent<Omit<React.HTMLProps<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;
    export const ModalClose: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
}
declare module "nova/ed/crdt/node/get-node-by-id" {
    import { PG } from "nova/ed/logic/ed-global";
    import { EBaseComp, EPage, PNode } from "nova/ed/logic/types";
    import { flattenTree } from "nova/ed/crdt/node/flatten-tree";
    export const getNodeById: (p: PG, id: string) => PNode | undefined;
    export const getActiveNode: (p: PG) => PNode | undefined;
    export const getActiveTree: (p: PG) => {
        nodes: {
            models: import("@minoru/react-dnd-treeview").NodeModel<PNode>[];
            array: PNode[];
            map: Record<string, PNode>;
        };
        readonly snapshot: import("nova/ed/logic/types").EPageContentTree;
        history: () => Promise<{
            undo: import("nova/ed/logic/types").SyncUndoItem[];
            redo: import("nova/ed/logic/types").SyncUndoItem[];
            history: Record<number, string>;
            ts: number;
        }>;
        undo: (count?: number) => void;
        redo: (count?: number) => void;
        listen: (fn: () => void) => import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        script_models: Record<string, import("nova/ed/crdt/node/load-script-models").ScriptModel>;
        var_items: import("nova/ed/crdt/node/var-items").TreeVarItems;
        reloadScriptModels(): Promise<void>;
        before_update: null | ((do_update: () => void) => void);
        update(action_name: string, fn: (opt: {
            tree: EPage["content_tree"];
            findNode: (id: string) => null | PNode;
            flatten(): ReturnType<typeof flattenTree>;
            findParent: (id: string) => null | PNode;
        }) => void, done?: (opt: {
            tree: EPage["content_tree"];
            findNode: (id: string) => null | PNode;
        }) => void): void;
        subscribe(fn: any): import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        watch<T>(fn?: (val: EPage["content_tree"]) => T): T | undefined;
        destroy: () => Promise<void>;
    } | {
        id: string;
        nodes: {
            models: import("@minoru/react-dnd-treeview").NodeModel<PNode>[];
            map: Record<string, PNode>;
            array: PNode[];
        };
        readonly snapshot: import("utils/types/item").IItem;
        history: () => Promise<{
            undo: import("nova/ed/logic/types").SyncUndoItem[];
            redo: import("nova/ed/logic/types").SyncUndoItem[];
            history: Record<number, string>;
            ts: number;
        }>;
        undo: (count?: number) => void;
        redo: (count?: number) => void;
        listen: (fn: () => void) => import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        script_models: Record<string, import("nova/ed/crdt/node/load-script-models").ScriptModel>;
        var_items: import("nova/ed/crdt/node/var-items").TreeVarItems;
        reloadScriptModels(): Promise<void>;
        before_update: null | ((do_update: () => void) => void);
        update(action_name: string, fn: (opt: {
            tree: EBaseComp["content_tree"];
            flatten(): ReturnType<typeof flattenTree>;
            findNode: (id: string) => null | PNode;
            findParent: (id: string) => null | PNode;
        }) => void, done?: (opt: {
            tree: EBaseComp["content_tree"];
            findNode: (id: string) => null | PNode;
        }) => void): void;
        subscribe(fn: any): import("nova/ed/crdt/lib/immer-yjs").UnsubscribeFn;
        watch<T>(fn?: (val: EBaseComp["content_tree"]) => T): T | undefined;
        destroy: () => Promise<void>;
    };
    export const updateNodeById: (p: PG, id: string, action_name: string, updateFn: (arg: {
        node: PNode;
        nodes: ReturnType<typeof flattenTree>;
        page_tree?: EPage["content_tree"];
        comp_tree?: EBaseComp["content_tree"];
    }) => void) => void;
}
declare module "nova/ed/popup/script/code/js/jsx-style" {
    export const jsxColorScheme: string;
}
declare module "nova/ed/popup/script/code/js/register-prettier" {
    import { Monaco } from "nova/ed/popup/script/code/js/enable-jsx";
    export const registerPrettier: (monaco: Monaco) => void;
}
declare module "nova/ed/popup/script/code/js/register-react" {
    import { Monaco } from "nova/ed/popup/script/code/js/enable-jsx";
    export const registerReact: (monaco: Monaco) => Promise<void>;
}
declare module "nova/ed/popup/script/code/js/default-code" {
    import { PG } from "nova/ed/logic/ed-global";
    export const defaultCode: {
        js: (p: PG) => Promise<string>;
        prop: (p: PG, name: string) => Promise<string>;
    };
}
declare module "nova/ed/popup/script/code/js/editor-opener" {
    import { Monaco, MonacoEditor } from "nova/ed/popup/script/code/js/enable-jsx";
    import { PG } from "nova/ed/logic/ed-global";
    export const registerEditorOpener: (editor: MonacoEditor, monaco: Monaco, p: PG) => void;
}
declare module "nova/ed/popup/script/code/js/typings-item" {
    export const typingsItem = "\nconst cx = null as ((...classNames: any[]) => string);\nconst css: (\n  tag: TemplateStringsArray | string,\n  ...props: Array<string | number | boolean | undefined | null>\n) => string;\nconst pathname: string;\nconst isEditor: boolean;\nconst isLayout: boolean;\nconst isMobile: boolean;\nconst isDesktop: boolean;\nconst __props: any;\nconst siteurl: (path:string) => string;\nconst preloaded: (url:string) => boolean;\ntype DeepReadonly<T> = T extends Function\n  ? T\n  : T extends object\n    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }\n    : T;\n\nconst defineLoop: <T extends any>(arg: {\n  list: T[],\n  loop_name: string;\n  key?: (arg: { item:T,index:number })=> any\n}) => T\n \nconst defineLocal: <\n  T extends Record<string, any>,\n  MODE extends \"auto\" | \"manual\"\n>(arg: {\n  value: T;\n  name: string;\n  render_mode: MODE;\n}) => MODE extends \"auto\"\n  ? DeepReadonly<T> & { set: T }\n  : T & { render: () => void } = null as any;\nconst IF: (prop: {condition?: boolean; then: ReactNode; else?: ReactNode}) => ReactNode;\nconst preload: (urls: string | string[], opt?: {\n  on_load?: (\n    pages: {\n      id: string;\n      url: string;\n      root: IRoot;\n    }[],\n    walk: (\n      root: { root: IRoot }[],\n      visit: (item: IContent) => void | Promise<void>\n    ) => void\n  ) => void;}) => ReactNode;\nconst navigate: (url: string,\n  params?: {\n    name?: string;\n    where?: any;\n    create?: any;\n    update?: any;\n    breads?: { label: string; url?: string }[];\n  }\n) => void;\nconst params: any;\nconst props = null as {className: string} & Record<string, any>; \nconst children = null as any;\nconst Loop = null as ((arg: {bind: any}) => ReactElement);\nconst Local = null as (<T extends Record<string, any>>(arg: {\n    name: string;\n    idx?: any;\n    value: T;\n    children?: any;\n    deps?: any[];\n    effect?: (\n      local: T \n    ) => void | (() => void) | Promise<void | (() => void)>;\n    hook?: (\n      local: T \n    ) => void | (() => void) | Promise<void | (() => void)>;\n    cache?: boolean;\n  }) => ReactElement);\n";
}
declare module "nova/ed/popup/script/code/prasi-code-update" {
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    import { PG } from "nova/ed/logic/ed-global";
    import { MonacoEditor } from "nova/ed/popup/script/code/js/create-model";
    import { Monaco } from "nova/ed/popup/script/code/js/enable-jsx";
    export const prasiTypings: (p: PG) => Promise<any[]>;
    export const reloadPrasiModels: (p: PG, from: string) => Promise<ScriptModel[]>;
    export const remountPrasiModels: (arg: {
        p: PG;
        models: Partial<ScriptModel>[];
        monaco: Monaco;
        editor: MonacoEditor;
        activeFileName: string;
        onChange?: (arg: {
            value: string;
            model: Partial<ScriptModel>;
            editor: MonacoEditor;
            monaco: Monaco;
            event: any;
        }) => void;
        onMount?: (m?: Partial<ScriptModel>) => void;
    }) => void;
    export const codeUpdate: {
        p: null | PG;
        timeout: any;
        queue: Record<string, {
            id: string;
            item_name: string;
            source: string;
            tailwind?: string;
            prop_name?: string;
            source_built?: string | null;
            local_name?: string;
            loop_name?: string;
            action_name?: string;
        }>;
        push(p: PG, id: string, source: string, arg?: {
            action_name?: string;
            prop_name?: string;
            local_name?: string;
            loop_name?: string;
            immediate?: boolean;
        }): void;
        executeUpdate(immediate?: boolean): void;
    };
}
declare module "nova/ed/popup/script/code/monaco-prop" {
    import { Monaco } from "@monaco-editor/react";
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    import { FC } from "react";
    import { MonacoEditor } from "nova/ed/popup/script/code/js/create-model";
    export const EdMonacoProp: FC<{
        className?: string;
        onChange?: (arg: {
            value: string;
            model: Partial<ScriptModel>;
            editor: MonacoEditor;
            monaco: Monaco;
            event: any;
        }) => void;
        div?: React.RefObject<HTMLDivElement>;
    }>;
}
declare module "nova/ed/popup/script/code/monaco-raw" {
    import { FC } from "react";
    import { MonacoEditor } from "nova/ed/popup/script/code/js/create-model";
    import { Monaco } from "nova/ed/popup/script/code/js/enable-jsx";
    export const MonacoRaw: FC<{
        id: string;
        value: string;
        onChange?: (value?: string) => void;
        lang: string;
        defaultValue?: string;
        div?: React.RefObject<HTMLDivElement>;
        onMount?: (arg: {
            monaco: Monaco;
            editor: MonacoEditor;
        }) => void;
    }>;
}
declare module "nova/ed/popup/script/code/js/default-val" {
    export const itemCssDefault = "& {\n  display: flex;\n\n  // &.mobile {}\n  // &.desktop {}\n  // &:hover {}\n}";
    export const itemJsDefault = "<div {...props} className={cx(props.className, \"\")}>\n  {children}\n</div>";
}
declare module "nova/ed/popup/script/code/monaco-item-js" {
    import { ScriptModel } from "nova/ed/crdt/node/load-script-models";
    import { FC } from "react";
    import { Monaco, MonacoEditor } from "nova/ed/popup/script/code/js/enable-jsx";
    export const MonacoItemJS: FC<{
        onChange?: (arg: {
            value: string;
            model: Partial<ScriptModel>;
            editor: MonacoEditor;
            monaco: Monaco;
            event: any;
        }) => void;
        className?: string;
        div?: React.RefObject<HTMLDivElement>;
    }>;
}
declare module "nova/ed/popup/script/code/prasi-code-item" {
    import { FC, RefObject } from "react";
    export const EdPrasiCodeItem: FC<{
        div: RefObject<HTMLDivElement>;
    }>;
}
declare module "utils/ui/auto-textarea" {
    import { TextareaHTMLAttributes } from "react";
    export function AutoHeightTextarea({ minRows, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & {
        minRows?: number;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/script/parts/ed-find-all-pane" {
    import { FC } from "react";
    export const EdCodeFindAllPane: FC<{}>;
}
declare module "nova/ed/popup/script/ed-workbench-body" {
    import { FC, ReactNode, RefObject } from "react";
    export const EdWorkbenchBody: FC<{
        side_open: boolean;
        children: (arg: {
            div: RefObject<HTMLDivElement>;
        }) => ReactNode;
        onSideClose: () => void;
    }>;
}
declare module "nova/ed/popup/script/parts/ed-code-history" {
    import { FC } from "react";
    export const EdCodeHistory: FC<{
        history_id: number;
        onHistoryPick: (id: number, should_close: boolean) => void;
    }>;
}
declare module "nova/ed/popup/script/parts/ed-find-all-btn" {
    export const EdCodeFindAllBtn: ({ onClick }: {
        onClick: () => void;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/script/parts/pane-action" {
    export const EdWorkbenchPaneAction: () => import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/form/Button" {
    import { FC, ReactNode } from "react";
    type ButtonProp = {
        disabled?: boolean;
        className?: string;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        appearance?: "secondary" | "subtle";
        children?: ReactNode;
    };
    export const Button: FC<ButtonProp>;
}
declare module "nova/ed/popup/script/parts/snippet" {
    import { FC } from "react";
    export const EdCodeSnippet: FC<{}>;
}
declare module "nova/ed/popup/script/ed-workbench" {
    import { PG } from "nova/ed/logic/ed-global";
    import { FC } from "react";
    export const EdScriptWorkbench: FC<{}>;
    export const closeEditor: (p: PG) => void;
    export const ChevronRight: () => import("react/jsx-runtime").JSX.Element;
    export const ChevronLeft: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/script/ed-item-script" {
    export const EdPopItemScript: () => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/popup/build/ed-save" {
    export const EdSave: () => import("react/jsx-runtime").JSX.Element;
}
declare module "utils/types/root" {
    import { EPageContentTree } from "nova/ed/logic/types";
    export type IRoot = EPageContentTree;
}
declare module "nova/ed/cprasi/cprasi" {
    import { FC } from "react";
    export const CPrasi: FC<{
        id: string;
        size?: string;
        name: string;
    }>;
}
declare module "nova/ed/ed-topbar" {
    import { PG } from "nova/ed/logic/ed-global";
    export const navPrevItem: (p: PG) => void;
    export const navNextItem: (p: PG) => void;
    export const EdTopBar: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/ed-keybinds" {
    import { PG } from "nova/ed/logic/ed-global";
    export const prasiKeybinding: (p: PG) => void;
}
declare module "nova/ed/crdt/tree-history" {
    import { CompTree } from "nova/ed/crdt/load-comp-tree";
    import { PageTree } from "nova/ed/crdt/load-page-tree";
    export const EdTreeHistory: ({ tree }: {
        tree: PageTree | CompTree;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/ui/top-btn" {
    import { ReactElement, ReactNode } from "react";
    import { Placement } from "@floating-ui/react";
    export const TopBtn: ({ children, className, innerClassName, disabled, underlight, onClick, style, popover, placement, }: {
        children: ReactNode;
        className?: string;
        innerClassName?: string;
        disabled?: boolean;
        underlight?: string;
        onClick?: React.MouseEventHandler<HTMLDivElement>;
        style?: "slim" | "normal";
        popover?: ReactElement | ((popover: {
            onClose: () => void;
        }) => ReactElement);
        placement?: Placement;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/tree/parts/prop-group-info" {
    import { PG } from "nova/ed/logic/ed-global";
    import { FNCompDef } from "utils/types/meta-fn";
    export const propGroupInfo: (p: PG, value: [string, FNCompDef], comp_id: string) => {
        is_group: boolean;
        is_group_child: boolean;
        group_expanded: boolean;
        group_name: string;
    };
}
declare module "nova/ed/tree/parts/sort-prop" {
    import { FNCompDef } from "utils/types/meta-fn";
    export const sortProp: (props: Record<string, FNCompDef>) => [string, FNCompDef][];
}
declare module "nova/ed/tree/master-prop/ed-mp-fields" {
    export const FieldButtons: (arg: {
        label: string;
        buttons: ({
            label: string;
            checked: () => boolean;
            check?: () => void;
        } | undefined)[];
    }) => import("react/jsx-runtime").JSX.Element;
    export const FieldCode: (arg: {
        label?: string;
        value?: string;
        default?: string;
        typings?: string;
        onBeforeChange?: (value: string) => string;
        onChange?: (value: string) => void;
        onBlur?: (value: string) => void;
        onOpenChange?: (open: boolean) => void;
        open?: boolean;
    }) => import("react/jsx-runtime").JSX.Element;
    export const FieldString: (arg: {
        label: string;
        value: string;
        onBeforeChange?: (value: string) => string;
        onChange?: (value: string) => void;
        onBlur?: (value: string) => void;
    }) => import("react/jsx-runtime").JSX.Element;
    export const FieldDropdown: (arg: {
        label: string;
        value: string;
        onChange?: (value: string) => void;
        list: {
            label: string;
            value: string;
        }[];
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/tree/master-prop/ed-mp-body-basic" {
    import { FC } from "react";
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdMasterPropBodyBasic: FC<{
        name: string;
        prop: FNCompDef;
        props: Record<string, FNCompDef>;
    }>;
}
declare module "nova/ed/tree/master-prop/ed-mp-popover" {
    import { FC } from "react";
    export const EdMasterPropDetail: FC<{
        children: any;
        onClose: () => void;
    }>;
}
declare module "nova/ed/tree/master-prop/ed-mp-name" {
    import { FC } from "react";
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdMasterPropName: FC<{
        name: string;
        prop: FNCompDef;
    }>;
}
declare module "nova/ed/tree/master-prop/ed-master-prop" {
    export const EdMasterProp: () => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/tree/parts/drag-preview" {
    import { DragPreviewRender, PlaceholderRender } from "@minoru/react-dnd-treeview";
    import { PNode } from "nova/ed/logic/types";
    import { FC } from "react";
    export const DragPreview: DragPreviewRender<PNode>;
    export const DEPTH_WIDTH = 5;
    export const Placeholder: FC<{
        node: Parameters<PlaceholderRender<PNode>>[0];
        params: Parameters<PlaceholderRender<PNode>>[1];
    }>;
}
declare module "nova/ed/tree/parts/key-map" {
    import { RenderParams } from "@minoru/react-dnd-treeview";
    import { KeyboardEvent } from "react";
    import { IItem } from "utils/types/item";
    import { PG } from "nova/ed/logic/ed-global";
    export const treeItemKeyMap: (p: PG, prm: RenderParams, item: IItem) => (e: KeyboardEvent) => void;
}
declare module "nova/ed/popup/expr/parts/expr-icon" {
    export const iconExpr: import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/tree/parts/node/node-action" {
    import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
    import { PNode } from "nova/ed/logic/types";
    export const EdTreeAction: ({ raw, }: {
        raw: NodeModel<PNode>;
        render_params: RenderParams;
    }) => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/tree/parts/node/node-tools" {
    import { IItem } from "utils/types/item";
    export const parseNodeState: ({ item }: {
        item: IItem;
    }) => {
        is_active: boolean;
        is_component: boolean;
        is_hover: boolean;
    };
}
declare module "nova/ed/tree/parts/node/node-render" {
    import { NodeRender } from "@minoru/react-dnd-treeview";
    import { PNode } from "nova/ed/logic/types";
    export const nodeRender: NodeRender<PNode>;
}
declare module "nova/ed/tree/parts/on-drop" {
    import { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
    import { PG } from "nova/ed/logic/ed-global";
    import { PNode } from "nova/ed/logic/types";
    export const treeOnDrop: (p: PG, tree: NodeModel<PNode>[], options: DropOptions<PNode>) => void;
    export const treeCanDrop: (p: PG, arg: DropOptions<PNode>) => boolean | undefined;
}
declare module "utils/ui/fuzzy" {
    export const fuzzy: <T extends object>(array: T[], field: string | {
        pk: keyof T;
        search: string[];
    }, search: string) => T[];
}
declare module "nova/ed/tree/parts/search" {
    import { NodeModel } from "@minoru/react-dnd-treeview";
    import { PG } from "nova/ed/logic/ed-global";
    import { PNode } from "nova/ed/logic/types";
    export const EdTreeSearch: () => import("react/jsx-runtime").JSX.Element;
    export const doTreeSearch: (p: PG) => NodeModel<PNode>[];
}
declare module "nova/ed/tree/ed-comp-tree" {
    import { CompTree } from "nova/ed/crdt/load-comp-tree";
    import { FC } from "react";
    export const EdCompTree: FC<{
        tree: CompTree;
    }>;
}
declare module "nova/ed/tree/ed-page-tree" {
    import { PageTree } from "nova/ed/crdt/load-page-tree";
    import { FC } from "react";
    export const EdPageTree: FC<{
        tree: PageTree;
    }>;
}
declare module "nova/ed/tree/parts/tree-top-bar" {
    export const EdTreeTopBar: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/ui/icons" {
    export const iconLog = "<svg version=\"1.1\" id=\"L2\"  width=\"15\" height=\"15\"  xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 100 100\" enable-background=\"new 0 0 100 100\" xml:space=\"preserve\"><circle fill=\"none\" stroke=\"currentColor\" stroke-width=\"4\" stroke-miterlimit=\"10\" cx=\"50\" cy=\"50\" r=\"48\"/><line fill=\"none\" stroke-linecap=\"round\" stroke=\"currentColor\" stroke-width=\"4\" stroke-miterlimit=\"10\" x1=\"50\" y1=\"50\" x2=\"85\" y2=\"50.5\"><animateTransform attributeName=\"transform\" dur=\"2s\" type=\"rotate\" from=\"0 50 50\" to=\"360 50 50\" repeatCount=\"indefinite\"/></line><line fill=\"none\" stroke-linecap=\"round\" stroke=\"currentColor\" stroke-width=\"4\" stroke-miterlimit=\"10\" x1=\"50\" y1=\"50\" x2=\"49.5\" y2=\"74\"><animateTransform attributeName=\"transform\" dur=\"15s\" type=\"rotate\" from=\"0 50 50\" to=\"360 50 50\" repeatCount=\"indefinite\"/></line></svg>";
    export const iconSite = "<svg width=\"13\" height=\"13\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path></svg>";
    export const iconSSR = "<svg width=\"12\" height=\"12\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3.30902 1C2.93025 1 2.58398 1.214 2.41459 1.55279L1.05279 4.27639C1.01807 4.34582 1 4.42238 1 4.5V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V4.5C14 4.42238 13.9819 4.34582 13.9472 4.27639L12.5854 1.55281C12.416 1.21403 12.0698 1.00003 11.691 1.00003L7.5 1.00001L3.30902 1ZM3.30902 2L7 2.00001V4H2.30902L3.30902 2ZM8 4V2.00002L11.691 2.00003L12.691 4H8ZM7.5 5H13V13H2V5H7.5ZM5.5 7C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H9.5C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7H5.5Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path></svg>";
    export const iconChevronDown = "<svg width=\"15\" height=\"15\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path></svg>";
    export const iconLoading = "<svg width=\"15\" height=\"15\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path></svg>";
    export const iconPlus = "<svg width=\"15\" height=\"15\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path></svg>";
    export const iconGear = "<svg width=\"15\" height=\"15\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2.14921 3.99996C2.14921 2.97778 2.97784 2.14915 4.00002 2.14915C5.02219 2.14915 5.85083 2.97778 5.85083 3.99996C5.85083 5.02213 5.02219 5.85077 4.00002 5.85077C2.97784 5.85077 2.14921 5.02213 2.14921 3.99996ZM4.00002 1.24915C2.48079 1.24915 1.24921 2.48073 1.24921 3.99996C1.24921 5.51919 2.48079 6.75077 4.00002 6.75077C5.51925 6.75077 6.75083 5.51919 6.75083 3.99996C6.75083 2.48073 5.51925 1.24915 4.00002 1.24915ZM5.82034 11.0001L2.49998 12.8369V9.16331L5.82034 11.0001ZM2.63883 8.21159C2.17228 7.9535 1.59998 8.29093 1.59998 8.82411V13.1761C1.59998 13.7093 2.17228 14.0467 2.63883 13.7886L6.57235 11.6126C7.05389 11.3462 7.05389 10.654 6.57235 10.3876L2.63883 8.21159ZM8.30001 9.00003C8.30001 8.61343 8.61341 8.30003 9.00001 8.30003H13C13.3866 8.30003 13.7 8.61343 13.7 9.00003V13C13.7 13.3866 13.3866 13.7 13 13.7H9.00001C8.61341 13.7 8.30001 13.3866 8.30001 13V9.00003ZM9.20001 9.20003V12.8H12.8V9.20003H9.20001ZM13.4432 2.19311C13.6189 2.01737 13.6189 1.73245 13.4432 1.55671C13.2675 1.38098 12.9826 1.38098 12.8068 1.55671L11 3.36353L9.19321 1.55674C9.01748 1.381 8.73255 1.381 8.55682 1.55674C8.38108 1.73247 8.38108 2.0174 8.55682 2.19313L10.3636 3.99992L8.55682 5.80671C8.38108 5.98245 8.38108 6.26737 8.55682 6.44311C8.73255 6.61885 9.01748 6.61885 9.19321 6.44311L11 4.63632L12.8068 6.44314C12.9826 6.61887 13.2675 6.61887 13.4432 6.44314C13.6189 6.2674 13.6189 5.98247 13.4432 5.80674L11.6364 3.99992L13.4432 2.19311Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path></svg>";
    export const iconTrash = "<svg width=\"15\" height=\"15\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path></svg>";
    export const iconModule = "<svg width=\"11\" height=\"11\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path></svg>";
    export const iconNewTab = "<svg width=\"15\" height=\"15\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5C9 6.5001 9 6.50021 9 6.50031V6.50035V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738\" fill=\"currentColor\"></path></svg>";
    export const iconScrollOn = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-scroll-text\"><path d=\"M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4\"/><path d=\"M19 17V5a2 2 0 0 0-2-2H4\"/><path d=\"M15 8h-5\"/><path d=\"M15 12h-5\"/></svg>";
    export const iconScrollOff = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-scroll\"><path d=\"M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4\"/><path d=\"M19 17V5a2 2 0 0 0-2-2H4\"/></svg>";
    export const iconUpload = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-upload\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"17 8 12 3 7 8\"/><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\"/></svg>";
    export const iconDownload = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-download\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"/></svg>";
    export const iconRebuild = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-pickaxe\"><path d=\"M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912\"/><path d=\"M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393\"/><path d=\"M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z\"/><path d=\"M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319\"/></svg>";
    export const iconRebuildLarge = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-pickaxe\"><path d=\"M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912\"/><path d=\"M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393\"/><path d=\"M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z\"/><path d=\"M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319\"/></svg>";
    export const iconWarning = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-triangle-alert\"><path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/><path d=\"M12 9v4\"/><path d=\"M12 17h.01\"/></svg>";
    export const iconHourglass = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-hourglass\"><path d=\"M5 22h14\"/><path d=\"M5 2h14\"/><path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\"/><path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\"/></svg>";
    export const iconVSCode = "<svg width=\"16px\" height=\"16px\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.573 0.275 C 11.507 0.294,11.421 0.327,11.382 0.348 C 11.343 0.369,9.999 1.520,8.396 2.906 C 6.792 4.291,5.462 5.424,5.440 5.424 C 5.418 5.424,4.776 4.956,4.013 4.384 C 3.251 3.813,2.585 3.327,2.533 3.306 C 2.383 3.243,2.065 3.256,1.920 3.330 C 1.754 3.416,0.189 4.975,0.094 5.150 C -0.036 5.390,-0.020 5.704,0.134 5.916 C 0.175 5.973,0.709 6.473,1.319 7.026 C 1.930 7.579,2.426 8.041,2.421 8.052 C 2.417 8.064,1.926 8.494,1.330 9.009 C 0.734 9.523,0.208 9.990,0.162 10.045 C -0.015 10.259,-0.044 10.597,0.093 10.849 C 0.189 11.024,1.752 12.583,1.920 12.670 C 2.086 12.757,2.417 12.759,2.573 12.675 C 2.632 12.644,3.273 12.173,3.997 11.629 L 5.315 10.641 5.424 10.741 C 5.484 10.796,6.713 11.909,8.154 13.214 C 10.000 14.885,10.820 15.610,10.926 15.667 L 11.076 15.747 11.750 15.747 L 12.424 15.747 14.055 14.933 C 15.555 14.185,15.695 14.110,15.803 13.991 C 16.016 13.754,16.000 14.232,16.000 8.253 C 16.000 2.432,16.009 2.785,15.849 2.554 C 15.791 2.470,15.439 2.223,14.215 1.406 C 13.358 0.834,12.602 0.341,12.535 0.311 C 12.435 0.266,12.348 0.255,12.053 0.248 C 11.816 0.243,11.652 0.252,11.573 0.275 M13.272 2.580 L 14.505 3.400 14.506 8.220 L 14.507 13.040 13.302 13.640 L 12.098 14.240 11.813 14.240 L 11.529 14.240 8.660 11.644 C 7.082 10.216,5.748 9.028,5.697 9.003 C 5.498 8.909,5.197 8.902,5.036 8.989 C 5.002 9.007,4.385 9.464,3.664 10.004 C 2.943 10.545,2.342 10.987,2.329 10.987 C 2.299 10.987,1.852 10.539,1.868 10.525 C 2.541 9.948,3.946 8.731,4.050 8.634 C 4.136 8.553,4.219 8.442,4.260 8.354 C 4.317 8.227,4.325 8.180,4.314 8.011 C 4.304 7.853,4.286 7.788,4.223 7.687 C 4.170 7.601,3.769 7.221,2.994 6.520 L 1.844 5.480 2.075 5.247 C 2.202 5.118,2.317 5.013,2.331 5.013 C 2.344 5.013,2.975 5.478,3.731 6.046 C 5.227 7.169,5.268 7.194,5.541 7.162 C 5.619 7.153,5.733 7.122,5.794 7.093 C 5.856 7.064,6.297 6.703,6.773 6.291 C 7.250 5.879,7.784 5.417,7.960 5.265 C 8.136 5.113,9.120 4.263,10.147 3.375 C 11.173 2.488,12.019 1.761,12.026 1.761 C 12.034 1.760,12.594 2.129,13.272 2.580 M11.640 4.257 C 11.611 4.263,11.539 4.286,11.480 4.308 C 11.421 4.329,10.401 5.046,9.213 5.901 C 6.867 7.590,6.920 7.547,6.851 7.854 C 6.825 7.969,6.825 8.031,6.851 8.146 C 6.919 8.453,6.868 8.410,9.213 10.099 C 10.401 10.954,11.427 11.675,11.493 11.700 C 11.840 11.833,12.236 11.671,12.422 11.320 L 12.493 11.187 12.493 8.000 L 12.493 4.813 12.422 4.680 C 12.333 4.512,12.208 4.391,12.053 4.324 C 11.926 4.268,11.729 4.236,11.640 4.257 M10.980 8.757 L 10.973 9.514 9.927 8.764 C 9.352 8.351,8.881 8.007,8.881 8.000 C 8.881 7.993,9.352 7.649,9.927 7.236 L 10.973 6.486 10.980 7.243 C 10.984 7.659,10.984 8.341,10.980 8.757 \" stroke=\"none\" fill=\"currentColor\" fill-rule=\"evenodd\"></path></svg>";
    export const iconServer = "<svg fill=\"currentColor\" width=\"13px\" height=\"13px\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\">\n              <path d=\"M0 0h16v16H0V0zm2 2v2h12V2H2zm0 4v2h12V6H2zm0 4v4h12v-4H2zm1 2c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1z\" fill-rule=\"evenodd\"/>\n          </svg>";
    export const iconLogout = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.875\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-log-out\"><path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><polyline points=\"16 17 21 12 16 7\"/><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"/></svg>";
    export const iconHistory = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-history\"><path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/><path d=\"M12 7v5l4 2\"/></svg>";
}
declare module "nova/ed/ed-left" {
    export const EdLeft: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/comp/prop-field/ed-prop-name" {
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdPropName: ({ name, field, onClick, }: {
        name: string;
        field: FNCompDef;
        onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/comp/prop-field/fields/ed-prop-code" {
    import { IItem } from "utils/types/item";
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdPropCode: ({ name, field, instance, }: {
        name: string;
        field: FNCompDef;
        instance: Exclude<IItem["component"], undefined>;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/comp/prop-field/fields/extract-value" {
    import { PG } from "nova/ed/logic/ed-global";
    import { FNCompDef } from "utils/types/meta-fn";
    export const extractValue: (p: PG, name: string, prop: FNCompDef) => {
        original_value: string;
        value: string;
        has_code: boolean;
    } | undefined;
    export const extractString: (name: string, str: string) => string;
}
declare module "nova/ed/right/comp/prop-field/fields/ed-prop-varpicker" {
    import { IItem } from "utils/types/item";
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdPropVarPicker: ({ name, field, instance, }: {
        name: string;
        field: FNCompDef;
        instance: Exclude<IItem["component"], undefined>;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/comp/prop-field/fields/ed-prop-string" {
    import { IItem } from "utils/types/item";
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdPropString: (arg: {
        name: string;
        field: FNCompDef;
        instance: Exclude<IItem["component"], undefined>;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/dropdown" {
    import { FC, ReactNode } from "react";
    type DropdownItem = {
        label: string;
        value: string;
    } | string;
    type DropdownExtProp = {
        value?: string;
        items?: DropdownItem[];
        popover?: {
            className?: string;
            itemClassName?: string;
            renderItem?: (val: DropdownItem, idx: number) => ReactNode;
        };
        onChange?: (value: string, idx: number, item: DropdownItem) => void;
    };
    export const Dropdown: FC<Omit<React.HTMLAttributes<HTMLInputElement>, keyof DropdownExtProp> & DropdownExtProp>;
}
declare module "nova/ed/right/comp/prop-field/fields/ed-prop-checkbox" {
    import { IItem } from "utils/types/item";
    import { FNCompDef } from "utils/types/meta-fn";
    type MetaOption = {
        label: string;
        alt?: string;
        value: any;
        checked?: boolean;
        options?: MetaOption[];
        reload?: string[];
    };
    export const EdPropCheckbox: ({ name, field, instance, options, }: {
        name: string;
        field: FNCompDef;
        instance: Exclude<IItem["component"], undefined>;
        options: MetaOption[];
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/comp/prop-field/fields/ed-prop-option" {
    import { IItem } from "utils/types/item";
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdPropOption: (arg: {
        name: string;
        field: FNCompDef;
        instance: Exclude<IItem["component"], undefined>;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/comp/prop-field/fields/ed-prop-list" {
    import { IItem } from "utils/types/item";
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdPropListHead: (arg: {
        name: string;
        field: FNCompDef;
        instance: Exclude<IItem["component"], undefined>;
    }) => import("react/jsx-runtime").JSX.Element | null;
    export const EdPropList: (arg: {
        name: string;
        field: FNCompDef;
        instance: Exclude<IItem["component"], undefined>;
    }) => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/right/comp/prop-field/ed-prop-field" {
    import { IItem } from "utils/types/item";
    import { FNCompDef } from "utils/types/meta-fn";
    export const EdPropField: (arg: {
        name: string;
        field: FNCompDef;
        instance: Exclude<IItem["component"], undefined>;
    }) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/comp/ed-comp-prop" {
    export const EdCompProp: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/comp/ed-comp-title" {
    export const EdCompTitle: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/right/style/ui/BoxSep" {
    import { FC, ReactElement } from "react";
    export const BoxSep: FC<{
        children: string | ReactElement | (ReactElement | string)[];
        className?: string;
    }>;
}
declare module "nova/ed/right/style/ui/Button" {
    import { FC, ReactNode } from "react";
    type ButtonProp = {
        disabled?: boolean;
        className?: string;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        appearance?: "secondary" | "subtle";
        children?: ReactNode;
    };
    export const Button: FC<ButtonProp>;
}
declare module "nova/ed/right/style/ui/FieldBtnRadio" {
    import { FC, ReactElement } from "react";
    export const FieldBtnRadio: FC<{
        value: any;
        update: (value: any) => void;
        disabled?: boolean;
        items: Record<string, ReactElement | String>;
    }>;
}
declare module "nova/ed/right/style/ui/FieldNumUnit" {
    import { PG } from "nova/ed/logic/ed-global";
    import { FC, ReactElement } from "react";
    export const num_drag: {
        disable_highlight: (p: PG) => void;
    };
    export const FieldNumUnit: FC<{
        label?: string;
        icon?: ReactElement;
        value: string;
        unit?: string;
        hideUnit?: boolean;
        update: (value: string, setDragVal?: (val: number) => void) => void;
        width?: string;
        positiveOnly?: boolean;
        disabled?: boolean | string;
        enableWhenDrag?: boolean;
        dashIfEmpty?: boolean;
        className?: string;
    }>;
}
declare module "nova/ed/right/style/ui/LayoutIcon" {
    import { FC } from "react";
    import { FNLayout } from "utils/types/meta-fn";
    export const AlignIcon: FC<{
        dir: FNLayout["dir"];
        pos: "start" | "center" | "end";
        className?: string;
    }>;
}
declare module "nova/ed/right/style/ui/LayoutPacked" {
    import { FC } from "react";
    import { FNAlign, FNLayout } from "utils/types/meta-fn";
    export const LayoutPacked: FC<{
        dir: FNLayout["dir"];
        align: FNAlign;
        onChange: (align: FNAlign) => void;
    }>;
}
declare module "nova/ed/right/style/ui/LayoutSpaced" {
    import { FC } from "react";
    import { FNAlign, FNLayout } from "utils/types/meta-fn";
    export const LayoutSpaced: FC<{
        dir: FNLayout["dir"];
        align: FNAlign;
        onChange: (align: FNAlign) => void;
    }>;
}
declare module "nova/ed/right/style/tools/responsive-val" {
    export const responsiveVal: <T>(item: any, key: string, mode: "desktop" | "mobile" | undefined, defaultVal: T) => T;
}
declare module "nova/ed/right/style/panel/auto-layout" {
    import { FC } from "react";
    import { FNLayout } from "utils/types/meta-fn";
    import { IItem } from "utils/types/item";
    type AutoLayoutUpdate = {
        layout: FNLayout;
    };
    export const PanelAutoLayout: FC<{
        value: IItem;
        mode: "desktop" | "mobile";
        update: <T extends keyof AutoLayoutUpdate>(key: T, val: AutoLayoutUpdate[T]) => void;
    }>;
}
declare module "nova/ed/right/style/ui/FieldColorPicker" {
    import { FC } from "react";
    export const FieldPickColor: FC<{
        value?: string;
        onChangePicker: (value: string) => void;
        onClose?: () => void;
        showHistory?: boolean;
    }>;
}
declare module "nova/ed/right/style/ui/FieldColorPopover" {
    import { FC, ReactElement } from "react";
    export const FieldColorPicker: FC<{
        children: ReactElement;
        value?: string;
        update: (value: string) => void;
        open: boolean;
        onOpen?: () => void;
        onClose?: () => void;
        showHistory?: boolean;
    }>;
}
declare module "nova/ed/right/style/ui/FieldColor" {
    import { FC } from "react";
    export const color: {
        openedPopupID: Record<string, boolean>;
        lastColorPicked: string;
    };
    export const FieldColor: FC<{
        popupID: string;
        value?: string;
        update: (value: string) => void;
        showHistory?: boolean;
    }>;
}
declare module "nova/ed/right/style/ui/style" {
    export const dropdownProp: {
        className: string;
        popover: {
            className: string;
            itemClassName: string;
        };
    };
}
declare module "nova/ed/right/style/panel/background" {
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { FNBackground } from "utils/types/meta-fn";
    type BackgroundUpdate = {
        bg: FNBackground;
    };
    export const PanelBackground: FC<{
        value: IItem;
        mode: "desktop" | "mobile";
        update: <T extends keyof BackgroundUpdate>(key: T, val: BackgroundUpdate[T]) => void;
    }>;
}
declare module "nova/ed/right/style/panel/border" {
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { FNBorder } from "utils/types/meta-fn";
    type BorderUpdate = {
        border: FNBorder;
    };
    export const PanelBorder: FC<{
        value: IItem;
        mode: "desktop" | "mobile";
        update: <T extends keyof BorderUpdate>(key: T, val: BorderUpdate[T]) => void;
    }>;
}
declare module "nova/ed/right/style/panel/dimension" {
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { FNDimension } from "utils/types/meta-fn";
    type DimensionUpdate = {
        dim: FNDimension;
    };
    export const PanelDimension: FC<{
        id: string;
        value: IItem;
        mode: "desktop" | "mobile";
        update: <T extends keyof DimensionUpdate>(key: T, val: DimensionUpdate[T]) => void;
    }>;
}
declare module "nova/ed/right/style/panel/font" {
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { FNFont } from "utils/types/meta-fn";
    type FontUpdate = {
        font: FNFont;
    };
    export const PanelFont: FC<{
        value: IItem;
        mode: "desktop" | "mobile";
        update: <T extends keyof FontUpdate>(key: T, val: FontUpdate[T]) => void;
    }>;
}
declare module "nova/ed/right/style/panel/padding" {
    import { FC } from "react";
    import { IItem } from "utils/types/item";
    import { FNPadding } from "utils/types/meta-fn";
    type PaddingUpdate = {
        padding: FNPadding;
    };
    export const PanelPadding: FC<{
        id: string;
        value: IItem;
        mode: "desktop" | "mobile";
        update: <T extends keyof PaddingUpdate>(key: T, val: PaddingUpdate[T]) => void;
    }>;
}
declare module "nova/ed/right/style/ui/SideBox" {
    import { FC, ReactNode } from "react";
    export const SideBox: FC<{
        children: ReactNode;
    }>;
}
declare module "nova/ed/right/style/ui/SideLabel" {
    import { FC, ReactNode } from "react";
    export const SideLabel: FC<{
        children: ReactNode;
        sep?: "top" | "bottom";
    }>;
}
declare module "nova/ed/right/style/ed-style-all" {
    import { FC } from "react";
    export const EdStyleAll: FC<{
        as_child?: boolean;
    }>;
}
declare module "nova/ed/ed-right" {
    export const EdRight: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/ed-vi-style" {
    import { PG } from "nova/ed/logic/ed-global";
    export const mainStyle: (p: PG) => string;
}
declare module "nova/ed/popup/comp/comp-group" {
    export const EdPopCompGroup: () => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/popup/comp/comp-picker/ctx-menu" {
    import { FC } from "react";
    export const EdCompPickerCtxMenu: FC<{
        event?: React.MouseEvent<HTMLElement, MouseEvent>;
        comp_id?: string;
        onClose: () => void;
        onEdit: () => void;
    }>;
}
declare module "nova/ed/popup/comp/comp-picker" {
    export const EdPopCompPicker: () => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/popup/script/code/js/update-active-code" {
    import { PG } from "nova/ed/logic/ed-global";
    export const updateActiveCodeFromServer: (p: PG) => void;
}
declare module "nova/ed/crdt/init-page" {
    import { PG } from "nova/ed/logic/ed-global";
    import { EPageContentTree } from "nova/ed/logic/types";
    export const initPage: (p: PG) => {
        comp_ids: Set<string>;
        uncleaned_comp_ids: Set<string>;
        prepare(content_tree: EPageContentTree): void;
    };
}
declare module "nova/ed/ed-base" {
    export const EdBase: () => import("react/jsx-runtime").JSX.Element;
    export const mobileCSS: string;
}
declare module "nova/ed/logic/ed-sync" {
    import { PG } from "nova/ed/logic/ed-global";
    export const loadSession: (p: PG) => import("react/jsx-runtime").JSX.Element | undefined;
    export const initSync: (p: PG) => boolean;
}
declare module "nova/ed/popup/debug/debug-popup" {
    export const DebugPopup: () => import("react/jsx-runtime").JSX.Element;
}
declare module "base/page/ed" {
    const _default_4: {
        url: string;
        component: import("react").FC<any>;
    };
    export default _default_4;
}
declare module "base/pages" {
    export const auth_login: {
        url: string;
        page: () => Promise<typeof import("base/page/auth/login")>;
    };
    export const auth_logout: {
        url: string;
        page: () => Promise<typeof import("base/page/auth/logout")>;
    };
    export const auth_register: {
        url: string;
        page: () => Promise<typeof import("base/page/auth/register")>;
    };
    export const all: {
        url: string;
        page: () => Promise<typeof import("base/page/all")>;
    };
    export const ed: {
        url: string;
        page: () => Promise<typeof import("base/page/ed")>;
    };
}
declare module "base/root" {
    import { FC } from "react";
    export const Root: FC<{}>;
}
declare module "utils/react/define-react" {
    export const defineReact: () => void;
}
declare module "utils/react/define-window" {
    export const defineWindow: (awaitServerUrl?: boolean) => Promise<void>;
}
declare module "index" {
    import "@fontsource/source-sans-3";
    import "./index.css";
}
declare module "base/global/content-editor" {
    import { component } from "prasi-db";
    import { TypedDoc, TypedMap } from "yjs-types";
    import { MItem } from "utils/types/item";
    import { FMComponent } from "utils/types/meta-fn";
    export type CompMap = TypedMap<Omit<component, "content_tree" | "component" | "updated_at"> & {
        content_tree: MItem;
        component: FMComponent;
        updated_at: string;
    }>;
    export type CompDoc = TypedDoc<{
        map: CompMap;
    }>;
}
declare module "base/global/page-render" {
    import { component } from "prasi-db";
    import { IItem } from "utils/types/item";
    export const PageRenderGlobal: {
        usage: "editor" | "render" | "preview";
        scope: {};
        passPropEntry: { [ENTRY_ID in string]: { [ELEMENT_ID in string]: any; }; };
        comps: Record<string, Omit<component, "content_tree"> & {
            content_tree: IItem;
        }>;
        failedComp: Set<string>;
        page_id: string;
        site: any;
        passPropTree: { [ELEMENT_ID in string]: string; };
    };
}
declare module "base/load/api/client-api" {
    export const apiClient: (base: string) => void;
}
declare module "nova/ed/cprasi/lib/prasi-db/db-inspect" {
    export type DBInspectTable = {
        columns: Record<string, {
            is_pk: boolean;
            type: string;
            optional: boolean;
            db_type: string;
            default?: any;
        }>;
        relations: Record<string, DBHasManyType | DBHasOneType>;
    };
    export type DBHasManyType = {
        type: "has-many";
        to: {
            table: string;
            fields: string[];
        };
        from: {
            table: string;
            fields: string[];
        };
    };
    export type DBHasOneType = {
        type: "has-one";
        to: {
            table: string;
            fields: string[];
        };
        from: {
            table: string;
            fields: string[];
        };
    };
    export type DBInspectResult = Record<string, DBInspectTable>;
}
declare module "nova/ed/crdt/node/loop-item" {
    import { IItem } from "utils/types/item";
    import { EComp } from "nova/ed/logic/types";
    export const loopItem: (items: IItem[], opt: {
        active_comp_id?: string;
        comps: Record<string, EComp>;
    }, fn: (arg: {
        item: IItem;
        parent?: IItem;
        path_name: string[];
        path_id: string[];
    }) => Promise<void>, recursive?: {
        parent: IItem;
        parent_comp?: IItem;
        path_name: string[];
        path_id: string[];
    }) => Promise<void>;
}
declare module "nova/ed/popup/build/ed-build" {
    export const EdBundle: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/expr/lib/group" {
    export enum ExprGroup {
        Condition = "Condition"
    }
    export const ExprGroupDefinition: {
        Condition: {
            icon: import("react/jsx-runtime").JSX.Element;
        };
    };
}
declare module "nova/ed/popup/expr/lib/var-def" {
    import { PG } from "nova/ed/logic/ed-global";
    import { VarUsage } from "utils/types/item";
    export const getVarDef: (p: PG, usage: VarUsage) => Readonly<import("utils/types/item").IVar<any>>;
}
declare module "nova/ed/popup/expr/lib/infer-type" {
    import { EType } from "nova/ed/popup/vars/lib/type";
    import { EDeepType, EOutputType, PExpr } from "nova/ed/popup/expr/lib/types";
    import { PG } from "nova/ed/logic/ed-global";
    export const inferType: (arg: {
        p: PG;
        expr: PExpr;
        item_id: string;
        prev?: EDeepType[];
    }) => EDeepType[];
    export const simplifyType: (type: EType) => EOutputType;
}
declare module "nova/ed/popup/expr/lib/eval" {
    import { EType } from "nova/ed/popup/vars/lib/type";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const evalExpr: (expr: PExpr) => {
        value: any;
        type: EType;
    };
}
declare module "nova/ed/popup/expr/parts/expr-parts-body" {
    import { FC } from "react";
    import { EOutputType, PExpr, PTypedExpr } from "nova/ed/popup/expr/lib/types";
    export const ExprPartBody: FC<{
        value: PTypedExpr<any>;
        parent?: {
            value: PExpr;
            name: string;
        };
        onChange: (value: PExpr) => void;
        expected_type?: EOutputType[];
    }>;
}
declare module "utils/shadcn/lib" {
    import { type ClassValue } from "clsx";
    export function cn(...inputs: ClassValue[]): string;
}
declare module "utils/shadcn/comps/ui/switch" {
    import * as React from "react";
    import * as SwitchPrimitives from "@radix-ui/react-switch";
    const Switch: React.ForwardRefExoticComponent<Omit<SwitchPrimitives.SwitchProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
    export { Switch };
}
declare module "nova/ed/popup/expr/parts/expr-parts-static" {
    import { ESimpleType } from "nova/ed/popup/vars/lib/type";
    import { FC } from "react";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const ExprPartsStatic: FC<{
        type: ESimpleType;
        value?: {
            kind: "static";
            value?: any;
            type: ESimpleType;
        };
        onChange: (value: PExpr) => void;
    }>;
}
declare module "nova/ed/popup/vars/lib/var-label" {
    import { FC, ReactNode } from "react";
    import { VarUsage } from "utils/types/item";
    import { EType } from "nova/ed/popup/vars/lib/type";
    export const EdVarLabel: FC<{
        value?: VarUsage;
        mode?: "short" | "long";
        empty?: ReactNode;
        className?: string;
        labelClassName?: string;
        onIconClick?: (e: React.MouseEvent) => void;
    }>;
    export const getTypeForPath: (type: EType, path: string[]) => any;
}
declare module "nova/ed/popup/vars/picker/picker-var" {
    import { Placement } from "@floating-ui/react";
    import { FC, ReactNode } from "react";
    import { VarUsage } from "utils/types/item";
    import { EBaseType } from "nova/ed/popup/vars/lib/type";
    export const EdVarPicker: FC<{
        children: any;
        filter_type?: EBaseType;
        popup_arrow?: Placement;
        add_options?: {
            label: ReactNode;
            onClick: () => void;
        }[];
        value?: VarUsage;
        onChange?: (value: VarUsage) => void;
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        item_id: string;
    }>;
}
declare module "nova/ed/popup/expr/parts/expr-parts-var" {
    import { FC } from "react";
    import { VarUsage } from "utils/types/item";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const ExprPartsVar: FC<{
        value?: VarUsage;
        onChange: (value: PExpr) => void;
    }>;
}
declare module "nova/ed/popup/expr/parts/expr-parts-field" {
    import { FC } from "react";
    import { EOutputType, PExpr } from "nova/ed/popup/expr/lib/types";
    export const ExprPartsField: FC<{
        name: string;
        value: {
            kind: "expr";
            name: string;
            expr: Record<string, PExpr>;
        };
        def: {
            fields: Record<string, {
                kind: "expression";
            }>;
        };
        expected_type?: EOutputType[];
        onChange: (value: PExpr) => void;
    }>;
}
declare module "nova/ed/popup/expr/parts/expr-parts-kind" {
    import { FC, ReactNode } from "react";
    import { EOutputType, PExpr, PTypedExpr } from "nova/ed/popup/expr/lib/types";
    export const ExprPartsKind: FC<{
        name: string;
        label?: ReactNode;
        expected_type?: EOutputType[];
        value: PTypedExpr<any>;
        onChange: (value: PExpr) => void;
        onFocusChange?: (focus: boolean) => void;
    }>;
}
declare module "nova/ed/popup/expr/list/condition/if" {
    const _default_5: import("nova/ed/popup/expr/lib/types").PExprDefinition<{
        condition: {
            kind: "expression";
            label: string;
        };
        then: {
            kind: "expression";
            label: string;
        };
        else_if: {
            label: string;
            kind: "expression";
            only_expr: string[];
            optional: true;
            multiple: true;
        };
        else: {
            kind: "expression";
            optional: true;
            label: string;
        };
    }>;
    export default _default_5;
}
declare module "nova/ed/popup/expr/lib/merge-type" {
    import { EDeepType } from "nova/ed/popup/expr/lib/types";
    export const mergeType: (...types: EDeepType[]) => EDeepType[];
}
declare module "nova/ed/popup/expr/list/condition/and" {
    const _default_6: import("nova/ed/popup/expr/lib/types").PExprDefinition<{
        left: {
            kind: "expression";
            label: string;
        };
        right: {
            kind: "expression";
            label: string;
        };
    }>;
    export default _default_6;
}
declare module "nova/ed/popup/expr/list/condition/is-exists" {
    const _default_7: import("nova/ed/popup/expr/lib/types").PExprDefinition<{
        value: {
            kind: "expression";
            label: string;
        };
    }>;
    export default _default_7;
}
declare module "nova/ed/popup/expr/list/condition/or" {
    const _default_8: import("nova/ed/popup/expr/lib/types").PExprDefinition<{
        left: {
            kind: "expression";
            label: string;
        };
        right: {
            kind: "expression";
            label: string;
        };
    }>;
    export default _default_8;
}
declare module "nova/ed/popup/expr/parts/all-expr" {
    import { PExprDefinition } from "nova/ed/popup/expr/lib/types";
    export const allExpression: (PExprDefinition<{
        condition: {
            kind: "expression";
            label: string;
        };
        then: {
            kind: "expression";
            label: string;
        };
        else_if: {
            label: string;
            kind: "expression";
            only_expr: string[];
            optional: true;
            multiple: true;
        };
        else: {
            kind: "expression";
            optional: true;
            label: string;
        };
    }> | PExprDefinition<{
        value: {
            kind: "expression";
            label: string;
        };
    }> | PExprDefinition<{
        left: {
            kind: "expression";
            label: string;
        };
        right: {
            kind: "expression";
            label: string;
        };
    }>)[];
    export const getExpressionDefinition: (name: string) => PExprDefinition<any>;
}
declare module "nova/ed/popup/expr/parts/expr-parts-list" {
    import { ReactNode } from "react";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const ExprPartList: ({ bind, filter, onChange, selected, }: {
        selected?: string;
        search?: string;
        bind?: (arg: {
            selectNext: () => void;
            selectPrev: () => void;
            pick: () => void;
        }) => void;
        filter?: (item: SingleGroup | SingleItem | SingleParent) => boolean;
        onChange?: (expr: PExpr, opt: SingleItem) => void;
    }) => import("react/jsx-runtime").JSX.Element;
    type SingleItem = {
        key: any;
        name: string;
        label: ReactNode;
        type: "item";
        data?: any;
    };
    type SingleParent = {
        key: any;
        label: ReactNode;
        type: "parent";
        data?: any;
        items: SingleItem[];
    };
    type SingleGroup = {
        name: string;
        type: "group";
        icon?: ReactNode;
        data?: any;
        items: (SingleItem | SingleParent)[];
    };
}
declare module "nova/ed/popup/expr/parts/expr-parts-add" {
    import { ESimpleType } from "nova/ed/popup/vars/lib/type";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const ExprPartAdd: import("react").ForwardRefExoticComponent<{
        onChange: (value: PExpr) => void;
        bind?: (arg: {
            focus: () => void;
        }) => void;
        content?: string;
        open?: boolean;
        expected_type?: (ESimpleType | "any")[];
        disabled?: boolean;
        onOpenChange?: (open: boolean) => void;
    } & import("react").RefAttributes<HTMLDivElement>>;
}
declare module "nova/ed/popup/expr/expr-editor-body" {
    import { FC } from "react";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const EdExprEditorBody: FC<{
        value?: PExpr;
        onChange: (value: PExpr) => void;
        item_id: string;
    }>;
}
declare module "nova/ed/popup/expr/expr-editor-top" {
    import { FC } from "react";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const EdExprEditorTop: FC<{
        value?: PExpr;
        onChange: (value: PExpr) => void;
        item_id: string;
    }>;
}
declare module "nova/ed/popup/expr/expr-editor" {
    import { FC } from "react";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const EdExprEditor: FC<{
        children: any;
        value?: PExpr;
        onChange: (value: PExpr) => void;
        item_id: string;
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
    }>;
}
declare module "nova/ed/popup/expr/picker-expr" {
    import { FC, ReactNode } from "react";
    import { PExpr } from "nova/ed/popup/expr/lib/types";
    export const EdExprPicker: FC<{
        value?: PExpr;
        onChange: (value?: PExpr) => void;
        empty?: ReactNode;
        open?: boolean;
        onOpenChange: (open?: boolean) => void;
    }>;
}
declare module "nova/ed/popup/expr/lib/change-expr" {
    export const changeExpr: () => void;
}
declare module "nova/ed/popup/expr/lib/is-type-equal" {
    import { EType } from "nova/ed/popup/vars/lib/type";
    export const isTypeEqual: (type1: EType, type2: EType) => boolean;
}
declare module "nova/ed/popup/flow/utils/find-node" {
    import { DeepReadonly, PFlow, PFNode, PFNodeBranch, PFNodeID, RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const immutableFindFlow: ({ id, pflow, parent_id, }: {
        id: string;
        pflow: RPFlow;
        parent_id?: string;
    }) => {
        flow: Readonly<PFNodeID[]>;
        idx: number;
        branch: void | DeepReadonly<PFNodeBranch>;
    };
    export const immutableFindPFNode: (nodes: DeepReadonly<Record<string, PFNode>>, flow: Readonly<PFNodeID[]>, fn: (arg: {
        flow: Readonly<PFNodeID[]>;
        idx: number;
        parent?: DeepReadonly<PFNode>;
        branch?: DeepReadonly<PFNodeBranch>;
        is_invalid: boolean;
    }) => boolean, visited?: Set<string>, arg?: {
        parent?: DeepReadonly<PFNode>;
        branch?: DeepReadonly<PFNodeBranch>;
    }) => boolean;
    export const findPFNode: (nodes: Record<string, PFNode>, flow: PFNodeID[], fn: (arg: {
        flow: PFNodeID[];
        idx: number;
        parent?: PFNode;
        branch?: PFNodeBranch;
        is_invalid: boolean;
    }) => boolean, visited?: Set<string>, arg?: {
        parent?: PFNode;
        branch?: PFNodeBranch;
    }) => boolean;
    export const findFlow: ({ id, pflow: pf, from, }: {
        id: string;
        pflow: PFlow;
        from?: string;
    }) => {
        flow: null | PFNodeID[];
        idx: number;
        branch: void | PFNodeBranch;
        parent: void | PFNode;
    };
    export const loopPFNode: (nodes: Record<string, PFNode>, flow: PFNodeID[], fn: (arg: {
        flow: PFNodeID[];
        idx: number;
        parent?: PFNode;
        branch?: PFNodeBranch;
        is_invalid: boolean;
    }) => boolean, visited?: Set<string>, arg?: {
        parent: PFNode;
        branch?: PFNodeBranch;
    }) => boolean;
}
declare module "nova/ed/popup/flow/runtime/runner" {
    import { DeepReadonly, PFNode, PFNodeBranch, RPFlow } from "nova/ed/popup/flow/runtime/types";
    type RunFlowOpt = {
        vars?: Record<string, any>;
        capture_console: boolean;
        delay?: number;
        visit_node?: (arg: {
            visited: PFRunVisited[];
            node: DeepReadonly<PFNode>;
            runningNodes: Set<PFRunVisited>;
            stopping: boolean;
        }) => void;
        before_node?: (arg: {
            visited: PFRunVisited[];
            node: DeepReadonly<PFNode>;
        }) => void;
        init?: (arg: {
            stop: () => void;
        }) => void;
        forced_stop?: boolean;
    };
    export const runFlow: (pf: RPFlow, opt?: RunFlowOpt) => Promise<{
        status: string;
        visited: PFRunVisited[];
        vars: {
            [x: string]: any;
        };
        reason?: undefined;
    } | {
        status: string;
        reason: string;
        visited?: undefined;
        vars?: undefined;
    }>;
    export type PFRunResult = Awaited<ReturnType<typeof runFlow>>;
    type PFRunVisited = {
        node: DeepReadonly<PFNode>;
        parent_branch?: PFNodeBranch;
        log: any[];
        branching?: boolean;
        tstamp: number;
        error: any;
    };
}
declare module "nova/ed/popup/flow/utils/flow-global" {
    import { Edge, Node, OnSelectionChangeParams, ReactFlowInstance } from "@xyflow/react";
    import { PFRunResult } from "nova/ed/popup/flow/runtime/runner";
    import { PFlow, RPFlow } from "nova/ed/popup/flow/runtime/types";
    import { PNode } from "nova/ed/logic/types";
    import { PRASI_NODE_DEFS } from "nova/ed/popup/flow/runtime/nodes";
    export type PrasiFlowPropLocal = {
        selection: {
            nodes: Node[];
            edges: Edge[];
            loading: boolean;
            selectAll: () => void;
            changes?: OnSelectionChangeParams;
        };
    };
    export const fg: {
        pflow: RPFlow;
        pointer_up_id: string;
        pointer_up_pos: {
            x: number;
            y: number;
        };
        pointer_to: null | {
            x: number;
            y: number;
        };
        updateNoDebounce(action_name: string, fn: (arg: {
            pflow: PFlow;
            node: PNode;
        }) => void, next?: (arg: {
            pflow?: RPFlow | null;
            node: PNode;
        }) => void): void;
        update(action_name: string, fn: (arg: {
            pflow: PFlow;
            node: PNode;
        }) => void, next?: (arg: {
            pflow?: RPFlow | null;
        }) => void): void;
        update_timeout: any;
        main: null | {
            reactflow: null | ReactFlowInstance<Node, Edge>;
            render: () => void;
            action: {
                resetSelectedElements: () => void;
                addSelectedNodes: (arg: string[]) => void;
                addSelectedEdges: (arg: string[]) => void;
                focusNode: (id: string) => void;
            };
        };
        run: null | PFRunResult;
        node_running: string[];
        resizing: Set<string>;
        prop: null | (PrasiFlowPropLocal & {
            render: () => void;
        });
        render(): void;
        prasi: {
            item_id: string;
            skip_init_update: boolean;
            updated_outside: boolean;
            resetDefault: (relayout: boolean) => void;
        };
        refreshFlow(pflow: RPFlow | PFlow): void;
        pickNodeType: null | {
            x: number;
            y: number;
            from_id: string;
            pick: (type: keyof PRASI_NODE_DEFS) => void;
        };
    };
}
declare module "nova/ed/popup/flow/utils/get-node-def" {
    import { PFNodeDefinition } from "nova/ed/popup/flow/runtime/types";
    export const getNodeDef: (type: string) => PFNodeDefinition<any> | undefined;
}
declare module "nova/ed/popup/flow/utils/connect-end" {
    import { Edge, FinalConnectionState } from "@xyflow/react";
    import { InternalNodeBase } from "@xyflow/system";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const pflowConnectEnd: ({ state, pflow, edges, }: {
        state: FinalConnectionState<InternalNodeBase>;
        pflow: RPFlow;
        edges: Edge[];
    }) => void;
}
declare module "nova/ed/popup/flow/utils/edge-changes" {
    import { Edge, EdgeChange } from "@xyflow/react";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const pflowEdgeChanges: ({ changes, pflow, edges, setEdges, }: {
        changes: EdgeChange<Edge>[];
        pflow: RPFlow;
        edges: Edge[];
        setEdges: (e: Edge[]) => void;
    }) => void;
}
declare module "nova/ed/popup/flow/utils/node-layout" {
    import { Edge, Node } from "@xyflow/react";
    export const nodeWidth = 250;
    export const getSize: (node: Node) => {
        w: number;
        h: number;
    };
    export const getLayoutedElements: (nodes: Node[], edges: Edge[], direction?: "TB" | "LR") => {
        nodes: Node[];
        edges: Edge[];
    };
}
declare module "nova/ed/popup/flow/utils/parse-node" {
    import { Edge, Node } from "@xyflow/react";
    import { DeepReadonly, PFNode, PFNodeID } from "nova/ed/popup/flow/runtime/types";
    export const EdgeType = "default";
    export const parseNodes: (nodes: DeepReadonly<Record<PFNodeID, PFNode>>, flow: DeepReadonly<PFNodeID[]>, opt?: {
        current?: {
            nodes: Node[];
            edges: Edge[];
        };
        existing?: {
            rf_nodes: Node[];
            rf_unflowed_nodes: Set<string>;
            rf_edges: Edge[];
            x: number;
            y: number;
            next_flow: DeepReadonly<PFNode>[];
        };
    }) => {
        nodes: Node[];
        edges: Edge[];
    };
    export const pfnodeToRFNode: (pfnode: PFNode) => Node;
}
declare module "nova/ed/popup/flow/utils/parse-flow" {
    import { Edge, Node } from "@xyflow/react";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const parseFlow: (pf: RPFlow, current: {
        nodes: Node[];
        edges: Edge[];
    }) => {
        nodes: any[];
        edges: never[];
        unflowed_nodes: any[];
        internal_unflowed: Set<string>;
    };
}
declare module "nova/ed/popup/flow/utils/remove-node" {
    import { Edge, NodeRemoveChange } from "@xyflow/react";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const removeNodes: ({ pflow, changes, edges, resetDefault, }: {
        pflow: RPFlow;
        changes: NodeRemoveChange[];
        edges: Edge[];
        resetDefault: (relayout: boolean) => void;
    }) => void;
}
declare module "nova/ed/popup/flow/utils/render-edge" {
    import { EdgeComponentProps } from "@xyflow/react";
    export const RenderEdge: ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd, }: EdgeComponentProps) => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/popup/flow/utils/node-type-label" {
    export const NodeTypeLabel: React.FC<{
        node: {
            type: string;
        };
    }>;
}
declare module "nova/ed/popup/flow/utils/render-node" {
    import { allNodeDefinitions } from "nova/ed/popup/flow/runtime/nodes";
    export const RenderNode: (arg: {
        id: string;
        data: {
            label: string;
            type: keyof typeof allNodeDefinitions;
        };
    }) => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/popup/flow/utils/restore-viewport" {
    import { Viewport } from "@xyflow/react";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const restoreViewport: ({ pflow, local, }: {
        pflow: RPFlow;
        local: {
            viewport?: Viewport;
            reactflow: any;
        };
    }) => void;
}
declare module "utils/shadcn/comps/ui/dialog" {
    import * as React from "react";
    import * as DialogPrimitive from "@radix-ui/react-dialog";
    const Dialog: React.FC<DialogPrimitive.DialogProps>;
    const DialogTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    const DialogPortal: React.FC<DialogPrimitive.DialogPortalProps>;
    const DialogClose: React.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React.RefAttributes<HTMLButtonElement>>;
    const DialogOverlay: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    const DialogContent: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    const DialogHeader: {
        ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    const DialogFooter: {
        ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    const DialogTitle: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
    const DialogDescription: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;
    export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, };
}
declare module "utils/shadcn/comps/ui/command" {
    import * as React from "react";
    import { type DialogProps } from "@radix-ui/react-dialog";
    const Command: React.ForwardRefExoticComponent<Omit<{
        children?: React.ReactNode;
    } & Pick<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        ref?: React.Ref<HTMLDivElement>;
    } & {
        asChild?: boolean;
    }, "key" | "asChild" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        label?: string;
        shouldFilter?: boolean;
        filter?: (value: string, search: string, keywords?: string[]) => number;
        defaultValue?: string;
        value?: string;
        onValueChange?: (value: string) => void;
        loop?: boolean;
        disablePointerSelection?: boolean;
        vimBindings?: boolean;
    } & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    interface CommandDialogProps extends DialogProps {
    }
    const CommandDialog: ({ children, ...props }: CommandDialogProps) => import("react/jsx-runtime").JSX.Element;
    const CommandInput: React.ForwardRefExoticComponent<Omit<Omit<Pick<Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React.InputHTMLAttributes<HTMLInputElement>> & {
        ref?: React.Ref<HTMLInputElement>;
    } & {
        asChild?: boolean;
    }, "key" | keyof React.InputHTMLAttributes<HTMLInputElement> | "asChild">, "type" | "onChange" | "value"> & {
        value?: string;
        onValueChange?: (search: string) => void;
    } & React.RefAttributes<HTMLInputElement>, "ref"> & React.RefAttributes<HTMLInputElement>>;
    const CommandList: React.ForwardRefExoticComponent<Omit<{
        children?: React.ReactNode;
    } & Pick<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        ref?: React.Ref<HTMLDivElement>;
    } & {
        asChild?: boolean;
    }, "key" | "asChild" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        label?: string;
    } & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    const CommandEmpty: React.ForwardRefExoticComponent<Omit<{
        children?: React.ReactNode;
    } & Pick<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        ref?: React.Ref<HTMLDivElement>;
    } & {
        asChild?: boolean;
    }, "key" | "asChild" | keyof React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    const CommandGroup: React.ForwardRefExoticComponent<Omit<{
        children?: React.ReactNode;
    } & Omit<Pick<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        ref?: React.Ref<HTMLDivElement>;
    } & {
        asChild?: boolean;
    }, "key" | "asChild" | keyof React.HTMLAttributes<HTMLDivElement>>, "value" | "heading"> & {
        heading?: React.ReactNode;
        value?: string;
        forceMount?: boolean;
    } & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    const CommandSeparator: React.ForwardRefExoticComponent<Omit<Pick<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        ref?: React.Ref<HTMLDivElement>;
    } & {
        asChild?: boolean;
    }, "key" | "asChild" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        alwaysRender?: boolean;
    } & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    const CommandItem: React.ForwardRefExoticComponent<Omit<{
        children?: React.ReactNode;
    } & Omit<Pick<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React.HTMLAttributes<HTMLDivElement>> & {
        ref?: React.Ref<HTMLDivElement>;
    } & {
        asChild?: boolean;
    }, "key" | "asChild" | keyof React.HTMLAttributes<HTMLDivElement>>, "onSelect" | "value" | "disabled"> & {
        disabled?: boolean;
        onSelect?: (value: string) => void;
        value?: string;
        keywords?: string[];
        forceMount?: boolean;
    } & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    const CommandShortcut: {
        ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, };
}
declare module "utils/shadcn/comps/ui/popover" {
    import * as React from "react";
    import * as PopoverPrimitive from "@radix-ui/react-popover";
    const Popover: React.FC<PopoverPrimitive.PopoverProps>;
    const PopoverTrigger: React.ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    const PopoverContent: React.ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    export { Popover, PopoverTrigger, PopoverContent };
}
declare module "nova/ed/popup/flow/utils/type-picker" {
    import { allNodeDefinitions } from "nova/ed/popup/flow/runtime/nodes";
    import * as React from "react";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const NodeTypePicker: React.FC<{
        value: keyof typeof allNodeDefinitions | "";
        onChange: (value: keyof typeof allNodeDefinitions) => void;
        name?: string;
        pflow: RPFlow;
        from_id: string;
        defaultOpen?: boolean;
        children?: React.ReactElement | ((opt: {
            setOpen: (open: boolean) => void;
            open: boolean;
        }) => any);
    }>;
    export function PFDropdown({ options, children, onChange, defaultValue, className, name, open, setOpen, }: {
        open: boolean;
        className?: string;
        name?: string;
        options: ({
            value: string;
            label: string;
            el?: React.ReactElement;
        } | string)[];
        onChange: (value: string) => void;
        defaultValue: string;
        children?: React.ReactElement;
        setOpen: (open: boolean) => void;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/flow/prasi-flow-editor" {
    import "@xyflow/react/dist/style.css";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export function PrasiFlowEditor({ pflow, resetDefault, update_on_relayout, bind, }: {
        pflow: RPFlow;
        resetDefault: () => void;
        update_on_relayout: boolean;
        bind: (arg: {
            fitView: () => void;
        }) => void;
    }): import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/popup/flow/utils/get-node-fields" {
    import { DeepReadonly, PFNode, PFNodeDefinition } from "nova/ed/popup/flow/runtime/types";
    export const getNodeFields: (node: DeepReadonly<PFNode>) => {
        data: Record<string, any>;
        definition: PFNodeDefinition<any>;
    } | undefined;
}
declare module "utils/script/debounce" {
    export function debounce<T>(func: (...args: T[]) => unknown, delay?: number): typeof func;
}
declare module "nova/ed/popup/flow/prop/pf-prop-code" {
    import { FC } from "react";
    import { DeepReadonly, PFField, PFNode } from "nova/ed/popup/flow/runtime/types";
    export const PFPropCode: FC<{
        field: PFField;
        node: DeepReadonly<PFNode>;
        value: string;
        error?: string;
        update: (value: string, valueBuilt: string, errors: string) => void;
    }>;
}
declare module "utils/shadcn/comps/ui/combobox" {
    import * as React from "react";
    export function Combobox({ options, children, onChange, defaultValue, className, onOpenChange, }: {
        className?: string;
        options: ({
            value: string;
            label: string;
            el?: React.ReactElement;
        } | string)[];
        onChange: (value: string) => void;
        defaultValue: string;
        onOpenChange?: (open: boolean) => void;
        children: React.ReactElement;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/flow/prop/pf-prop-node-field" {
    import { FC } from "react";
    import { DeepReadonly, PFField, PFNode, RPFlow } from "nova/ed/popup/flow/runtime/types";
    export type FieldChangedAction = "text-changed" | "option-picked" | "buttons-checked" | "array-added" | "array-deleted" | "field-cleared" | "code-changed";
    export const PFPropNodeField: FC<{
        field: PFField;
        node: DeepReadonly<PFNode>;
        name: string;
        value: any;
        path?: string[];
        pflow: RPFlow;
    }>;
}
declare module "nova/ed/popup/flow/prop/pf-prop-node" {
    import { FC } from "react";
    import { DeepReadonly, PFNode, RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const PFPropNode: FC<{
        node: DeepReadonly<PFNode>;
        pflow: RPFlow;
    }>;
}
declare module "nova/ed/popup/flow/prop/pf-prop.edge" {
    import { Edge } from "@xyflow/react";
    import { FC } from "react";
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const PFPropEdge: FC<{
        edge: Edge;
        pflow: RPFlow;
    }>;
}
declare module "nova/ed/popup/flow/prasi-flow-prop" {
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const PrasiFlowProp: ({ pflow }: {
        pflow: RPFlow;
    }) => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/popup/flow/prasi-flow-runner" {
    import { RPFlow } from "nova/ed/popup/flow/runtime/types";
    export const PrasiFlowRunner: ({ pflow }: {
        pflow: RPFlow;
    }) => import("react/jsx-runtime").JSX.Element;
    export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
        size?: number;
        className?: string;
    }
    export const LoadingSpinner: ({ size, className, ...props }: ISVGProps) => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/flow/runtime/lib/create-node" {
    import { PRASI_NODE_DEFS } from "nova/ed/popup/flow/runtime/nodes";
    import { PFNode, PFNodeBranch } from "nova/ed/popup/flow/runtime/types";
    type NODE_TYPES = keyof PRASI_NODE_DEFS;
    export const createNode: <T extends keyof PRASI_NODE_DEFS>(create: { [K in keyof PRASI_NODE_DEFS[T]["fields"]]: any; } & {
        name?: string;
        type: T;
        vars?: Record<string, any>;
        branches?: PFNodeBranch[];
    }) => {
        id: string;
        type: string;
        vars: Record<string, any> | undefined;
        branches: PFNodeBranch[] | undefined;
    };
    export const createManyNodes: (nodes: Record<string, {
        name?: string;
        type: NODE_TYPES;
        vars?: Record<string, any>;
        branches?: PFNodeBranch[];
    } & Record<string, any>>) => Record<string, PFNode>;
    export const createIds: (total: number) => string[];
}
declare module "nova/ed/popup/flow/utils/prasi/default-flow" {
    export const defaultFlow: (type: "item", name: string, start_id: string) => {
        id: string;
        name: string;
        nodes: Record<string, import("nova/ed/popup/flow/runtime/types").PFNode>;
        flow: {
            [x: string]: string[];
        };
    };
}
declare module "nova/ed/popup/flow/utils/prasi/init-adv" {
    import { CompTree } from "nova/ed/crdt/load-comp-tree";
    import { PageTree } from "nova/ed/crdt/load-page-tree";
    import { PNode } from "nova/ed/logic/types";
    export const initAdv: (node?: PNode, tree?: PageTree | CompTree) => void;
}
declare module "nova/ed/popup/flow/prasi-flow" {
    export const EdPrasiFlow: () => void;
}
declare module "nova/ed/popup/flow/runtime/debugger" {
    export const debugFlow: () => void;
}
declare module "nova/ed/popup/flow/runtime/test/fixture" {
    import { PFlow } from "nova/ed/popup/flow/runtime/types";
    export const sampleFlow: () => PFlow;
}
declare module "nova/ed/popup/flow/runtime/test/simple.test" { }
declare module "nova/ed/popup/flow/utils/caret-pos" {
    interface CaretPosition {
        start: number;
        end: number;
    }
    export function saveCaretPosition(element: HTMLInputElement | HTMLTextAreaElement): CaretPosition | null;
    export function restoreCaretPosition(element: HTMLInputElement | HTMLTextAreaElement, position: CaretPosition | null): void;
    export const restoreFocus: (value: any, ref?: {
        current: any;
    }) => (el: any) => void;
    export const lockFocus: (value: null, ref: {
        current: any;
    }) => void;
}
declare module "nova/ed/popup/flow/utils/gen-pf-node" {
    import { Edge, Node } from "@xyflow/react";
    export const generatePFNode: (opt: {
        nodes: Node[];
        edges: Edge[];
    }) => void;
}
declare module "nova/ed/popup/flow/utils/has-cycle" {
    import { Edge, Node } from "@xyflow/react";
    export const hasCycle: (nodes: Node[], edges: Edge[], visited?: Set<string>, inode?: Node) => boolean;
}
declare module "nova/ed/popup/flow/utils/is-main-node" {
    import { Edge } from "@xyflow/react";
    import { PFNode } from "nova/ed/popup/flow/runtime/types";
    export const isMainPFNode: ({ id, nodes, edges, mode, }: {
        id: string;
        nodes: Record<string, PFNode>;
        edges: Edge[];
        mode?: "source" | "target";
    }) => boolean;
}
declare module "nova/ed/popup/flow/utils/save-pf" {
    import { PFlow } from "nova/ed/popup/flow/runtime/types";
    export const savePF: (name: string, pf: PFlow | null, opt?: {
        then?: () => void;
    }) => void;
}
declare module "nova/ed/popup/flow/utils/simple-popover" {
    import { FC, ReactElement } from "react";
    export const SimplePopover: FC<{
        content?: ReactElement;
        children: ReactElement;
        className?: string;
        disabled?: boolean;
    }>;
}
declare module "nova/ed/popup/script/code/js/clean-models" {
    import type { OnMount } from "@monaco-editor/react";
    export type MonacoEditor = Parameters<OnMount>[0];
    type Monaco = Parameters<OnMount>[1];
    export const monacoCleanModel: (monaco: Monaco) => void;
}
declare module "nova/ed/popup/script/code/js/on-change" {
    import { PG } from "nova/ed/logic/ed-global";
    export const jsOnChange: (val: string, local: {
        change_timeout: any;
    }, p: PG, id: string) => void;
}
declare module "nova/ed/popup/script/jsx-highlight/worker/define" {
    export const JsxToken: {
        readonly angleBracket: "jsx-tag-angle-bracket";
        readonly attributeKey: "jsx-tag-attribute-key";
        readonly tagName: "jsx-tag-name";
        readonly expressionBraces: "jsx-expression-braces";
        readonly text: "jsx-text";
        readonly orderTokenPrefix: "jsx-tag-order";
    };
}
declare module "nova/ed/popup/script/jsx-highlight/worker/tool" {
    import { Typescript } from "nova/ed/popup/script/jsx-highlight/worker/typescript/dev";
    /**
     * 获取对应下标所处行列数据
     * @param {*} index 索引下标(以1开始)
     * @param {*} lines 每行长度数据
     * @returns
     */
    export const getRowAndColumn: (index: number, lines: number[]) => {
        row: number;
        column: number;
    };
    /**
     * 获取节点位置
     * @param {} node 节点
     * @returns
     */
    export const getNodeRange: (node: Typescript.Node) => number[];
    export const calcPosition: (node: Typescript.Node, lines: number[]) => {
        indexes: number[];
        positions: {
            row: number;
            column: number;
        }[];
    };
}
declare module "nova/ed/popup/script/jsx-highlight/worker/dispose-jsx-element-or-fragment" {
    import { Data } from "nova/ed/popup/script/jsx-highlight/worker/types";
    /**
     * 处理 jsx element 或者 fragment
     * @param {*} data
     */
    export const disposeJsxElementOrFragment: (data: Data) => void;
}
declare module "nova/ed/popup/script/jsx-highlight/worker/dispose-jsx-attribute-key" {
    import { Data } from "nova/ed/popup/script/jsx-highlight/worker/types";
    /**
     * 分析jsx attribute key
     * @param data
     */
    export const disposeJsxAttributeKey: (data: Data) => void;
}
declare module "nova/ed/popup/script/jsx-highlight/worker/dispose-jsx-expression" {
    import { Data } from "nova/ed/popup/script/jsx-highlight/worker/types";
    export const disposeJsxExpression: (data: Data) => void;
}
declare module "nova/ed/popup/script/jsx-highlight/worker/dispose-jsx-text" {
    import { Data } from "nova/ed/popup/script/jsx-highlight/worker/types";
    export const disposeJsxText: (data: Data) => void;
}
declare module "nova/ed/popup/script/jsx-highlight/worker/analysis" {
    import { Classification, Config } from "nova/ed/popup/script/jsx-highlight/worker/types";
    export const analysis: (filePath: string, code: string, config?: Config) => Classification[];
}
declare module "nova/ed/popup/script/jsx-highlight/worker/index" { }
declare module "nova/ed/popup/script/parts/prop-gen" {
    export const EdPropGen: () => import("react/jsx-runtime").JSX.Element | null | undefined;
}
declare module "nova/ed/popup/vars/picker/picker-rename" {
    import { FC } from "react";
    export const EdPickerRename: FC<{
        name: string;
        path: string[];
        onRename: (arg: {
            path: string[];
            new_name: string;
            old_name: string;
        }) => void;
    }>;
    export const definePickerRename: (arg: {
        path: string[];
    }) => FC<{
        name: string;
        path: string[];
        onRename: (arg: {
            path: string[];
            new_name: string;
            old_name: string;
        }) => void;
    }>;
}
declare module "nova/ed/popup/vars/picker/picker-type" {
    import { FC } from "react";
    import { EObjectEntry, EType, EVChildren } from "nova/ed/popup/vars/lib/type";
    export const EdTypePicker: FC<{
        children: EVChildren;
        type: EType;
        onChange: (path: string[], type: EType | EObjectEntry, valuePath?: string[]) => void;
        path: string[];
        valuePath?: string[];
        value: any;
        name?: string;
        markChanged?: (path: string[]) => void;
        changed?: number;
    }>;
}
declare module "nova/ed/popup/vars/picker/picker-boolean" {
    import { FC } from "react";
    export const EdPickerBoolean: FC<{
        value: boolean;
        onChange: (value: boolean) => void;
        className?: string;
    }>;
}
declare module "nova/ed/popup/vars/picker/picker-object" {
    import { FC } from "react";
    import { EObjectEntry, EObjectType, EType, EVChildren } from "nova/ed/popup/vars/lib/type";
    export const RenderObject: FC<{
        type: EObjectType;
        children: EVChildren;
        path: string[];
        className?: string;
        onChange: (path: string[], type: EType | EObjectEntry) => void;
        focus: boolean;
        onAdded: () => void;
        onFocus: () => void;
        value: any;
        valuePath: string[];
        markChanged: (path: string[]) => void;
        setValue: (path: string[], value: any) => void;
    }>;
}
declare module "nova/ed/popup/vars/picker/picker-array" {
    import { FC } from "react";
    import { EArrayType, EObjectEntry, EType, EVChildren } from "nova/ed/popup/vars/lib/type";
    export const RenderArray: FC<{
        type: EArrayType;
        children: EVChildren;
        path: string[];
        className?: string;
        value: any;
        valuePath: string[];
        onChange: (path: string[], type: EType | EObjectEntry) => void;
        setValue: (path: string[], value: any) => void;
        markChanged: (path: string[]) => void;
    }>;
}
declare module "nova/ed/popup/vars/picker/picker-lines" {
    import { FC } from "react";
    import { EObjectEntry, EType, EVChildren } from "nova/ed/popup/vars/lib/type";
    export const EdPickerLines: FC<{
        className: string;
        type: EType;
        children: EVChildren;
        onChange: (path: string[], type: EType | EObjectEntry, valuePath?: string[]) => void;
        path: string[];
        valuePath: string[];
        value: any;
        markChanged?: (path: string[]) => void;
        setValue: (path: string[], value: any) => void;
    }>;
}
declare module "nova/ed/popup/vars/picker/picker-number" {
    import { FC } from "react";
    export const EdPickerNumber: FC<{
        value: number;
        onChange: (value: number) => void;
    }>;
}
declare module "nova/ed/popup/vars/picker/picker-string" {
    import { FC } from "react";
    export const EdPickerString: FC<{
        value: string;
        onChange: (value: string) => void;
    }>;
}
declare module "nova/ed/popup/vars/ed-var-edit" {
    import { FC, ReactElement } from "react";
    import { IVar } from "utils/types/item";
    import { EObjectEntry, EType } from "nova/ed/popup/vars/lib/type";
    export const EdVarEdit: FC<{
        variable: IVar<any>;
        onChange: (arg: {
            path: string;
            type: EType | EObjectEntry | undefined;
            valuePath?: string;
        }) => void;
        onRename: (arg: {
            path: string[];
            new_name: string;
            old_name: string;
        }) => void;
        setValue: (path: string[], value: any) => void;
        leftContent?: ReactElement;
    }>;
}
declare module "nova/ed/popup/vars/lib/usage" {
    import { PNode } from "nova/ed/logic/types";
    import { IVar, VarUsage } from "utils/types/item";
    export const getVarUsage: (v: IVar<any>, findNode: (id: string) => null | PNode) => {
        item_id: string;
        usage: VarUsage;
        place: "loop" | "content";
    }[];
}
declare module "nova/ed/popup/vars/ed-var-item" {
    import { PG } from "nova/ed/logic/ed-global";
    import { PNode } from "nova/ed/logic/types";
    import { FC } from "react";
    export const EdVarItem: FC<{
        id: string;
        name: string;
        node: PNode;
        opened: boolean;
        p: PG;
    }>;
}
declare module "nova/ed/popup/vars/ed-var-list" {
    export const EdVarList: () => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/popup/vars/lib/style" {
    export const prasiExprStyle: string;
}
declare module "nova/ed/popup/vars/lib/var-icon" {
    export const iconVar: import("react/jsx-runtime").JSX.Element;
}
declare module "nova/ed/popup/vars/picker/picker-var-expr" {
    import { FC, ReactNode } from "react";
    import { IFlowOrVar } from "utils/types/item";
    export const EdVarExprPicker: FC<{
        value?: IFlowOrVar;
        onChange: (value?: IFlowOrVar) => void;
        empty: ReactNode;
        open: boolean;
        onOpenChange: (open: boolean) => void;
    }>;
}
declare module "nova/ed/right/events/default-event" {
    export const defaultEventFlow: (type: string) => {
        id: string;
        name: string;
        nodes: Record<string, import("nova/ed/popup/flow/runtime/types").PFNode>;
        flow: {
            [x: string]: string[];
        };
    };
}
declare module "nova/ed/right/events/ed-event-item" {
    import { PNode } from "nova/ed/logic/types";
    import { FC } from "react";
    export const EdEventItem: FC<{
        type: string;
        node: PNode;
    }>;
}
declare module "nova/ed/right/events/ed-events" {
    export const EdEvents: () => import("react/jsx-runtime").JSX.Element | null;
}
declare module "nova/ed/right/style/tools/dynamic-import" {
    export function importModule(url: string): "" | Promise<unknown>;
    export default importModule;
}
declare module "nova/ed/right/style/tools/fill-id" {
    import { IItem } from "utils/types/item";
    export const fillID: (object: IItem, modify?: (obj: IItem) => boolean, currentDepth?: number) => IItem;
}
declare module "nova/ed/right/style/tools/flat-tree" {
    import { IItem } from "utils/types/item";
    export const flatTree: (item: Array<IItem>) => any;
}
declare module "nova/ed/tree/parts/node/code-highlight" {
    import { ShjLanguage } from "@speed-highlight/core";
    import { FC } from "react";
    import "@speed-highlight/core/themes/github-light.css";
    export const CodeHighlight: FC<{
        children: any;
        language?: ShjLanguage;
        format?: (input: string) => string;
    }>;
}
declare module "nova/prod/rsbuild.config" {
    const _default_9: import("@rsbuild/core").RsbuildConfig;
    export default _default_9;
}
declare module "nova/prod/loader/base" {
    export const base: {
        root: URL;
        url(...arg: any[]): string;
        readonly pathname: string;
        init(): void;
    };
}
declare module "nova/prod/loader/page" {
    export const loadPages: (ids: string[]) => Promise<Record<string, import("nova/ed/logic/types").EPageContentTree>>;
}
declare module "nova/prod/loader/route" {
    import { EPageContentTree } from "nova/ed/logic/types";
    export type PageRoute = {
        id: string;
        url: string;
        root: EPageContentTree;
        loading?: true;
    };
    export const loadRouter: () => Promise<{
        router: import("radix3").RadixRouter<{
            id: string;
            url: string;
            root?: EPageContentTree;
        }>;
        pages: PageRoute[];
        site: {
            id: string;
            name: string;
            domain: string;
            responsive: string;
            api_url: string;
        };
        layout: {
            id: string;
            root: null | EPageContentTree;
        };
    }>;
    export type ProdRouter = Awaited<ReturnType<typeof loadRouter>>;
}
declare module "nova/prod/react/store" {
    import { apiProxy } from "base/load/api/api-proxy";
    import { dbProxy } from "base/load/db/db-proxy";
    import { PageRoute, ProdRouter } from "nova/prod/loader/route";
    import { IItem } from "utils/types/item";
    import { EBaseComp, EPage } from "nova/ed/logic/types";
    export const useProdState: <Z extends object>(selector: (arg: {
        ref: {
            router: null | ProdRouter["router"];
            api: null | ReturnType<typeof apiProxy>;
            db: null | ReturnType<typeof dbProxy>;
            pages: PageRoute[];
            timeout: {
                comps: any;
            };
            promise: {
                comps: Record<string, {
                    promise: Promise<IItem>;
                    resolve: (item: IItem) => void;
                }>;
            };
            comps: Record<string, EBaseComp>;
            page: null | PageRoute;
            layout: {
                id: string;
                root: null | EPage["content_tree"];
            };
            vscode_exports: any;
        };
        state: {
            readonly ts: number;
            readonly pathname: string;
            readonly mode: "mobile" | "desktop";
            readonly site: {
                readonly id: string;
                readonly name: string;
                readonly domain: string;
                readonly responsive: string;
                readonly api_url: string;
            };
            readonly status: {
                readonly router: "init" | "loading" | "ready";
                readonly comps: {
                    readonly [x: string]: "loading" | "init";
                };
            };
        };
        action: {
            initRouter(): void;
            loadComp(ids: string[]): void;
            loadPage(page: PageRoute): void;
        };
    }) => Z, instance_name?: string) => Z & {
        update: (fn: (state: {
            ts: number;
            pathname: string;
            mode: "mobile" | "desktop";
            site: {
                id: string;
                name: string;
                domain: string;
                responsive: string;
                api_url: string;
            };
            status: {
                router: "init" | "loading" | "ready";
                comps: Record<string, "init" | "loading">;
            };
        }) => void) => void;
    };
    export const rawProd: () => {
        state: any;
        ref: any;
    };
}
declare module "nova/prod/react/router" {
    export const ProdRouter: import("react").MemoExoticComponent<() => import("react/jsx-runtime").JSX.Element>;
}
declare module "nova/prod/react/entry" {
    export const isPreview: () => boolean;
    export const PrasiEntry: () => import("react/jsx-runtime").JSX.Element;
}
declare module "nova/prod/root/font" {
    import "@fontsource/source-sans-3";
}
declare module "nova/prod/root/main" {
    import "../../../index.css";
}
declare module "utils/script/prisma-extend" {
    export const prismaExtendType = "{\n  _batch: {\n    update: (\n      batch: { \n        table: string, \n        data: any, \n        where: any \n      }[]\n    ) => Promise<void>;\n    upsert: (arg: {\n      table: string;\n      where: any;\n      data: any[];\n      mode?: \"field\" | \"relation\";\n    }) => Promise<void>;\n  };\n  _schema: {\n    tables: () => Promise<string[]>;\n    columns: (table: string) => Promise<\n      Record<\n        string,\n        {\n          is_pk: boolean;\n          type: string;\n          optional: boolean;\n          db_type: string;\n          default?: any\n        } \n      >\n    >;\n    rels: (table: string) => Promise<Record<string, {\n      type: 'has-many' | 'has-one';\n      to: {\n        table: string, \n        fields: string[]\n      };\n      from: { \n        table: string, \n        fields: string[]\n      }\n    }>>;\n  }\n}";
}
declare module "utils/script/types/item-type" {
    type PrasiItemSingle = {
        id: string;
        name: string;
        type: "item" | "text";
        adv?: {
            js?: string;
            jsBuilt?: string;
            css?: string;
            html?: string;
        };
        text?: string;
        html?: string;
        component?: {
            id: string;
            props: Record<string, {
                type: "string" | "raw";
                value: string;
                valueBuilt?: string;
            }>;
        };
        childs: PrasiItemSingle[];
    };
    export type PrasiItem = PrasiItemSingle & {
        update: (fn: () => Promise<void> | void) => void;
    };
}
declare module "utils/script/types/type-stringify" {
    export const typeStringify: (this: any, key: string, value: any) => any;
    export const typeReviver: (key: any, value: any) => any;
}
declare module "utils/types/render" {
    import { IItem } from "utils/types/item";
    import { IRoot } from "utils/types/root";
    export type COMPONENT_ID = string;
    export type PAGE_ID = string;
    export type COMPONENT_PROPS = Record<string, any>;
    export type PRASI_PAGE = {
        id: string;
        url: string;
        name: string;
        js_compiled?: string;
        content_tree?: IRoot | null;
        updated_at?: Date;
    };
    export type PRASI_COMPONENT = {
        id: string;
        name: string;
        content_tree: IItem;
    };
}
declare module "utils/types/script" {
    export type SingleScope = {
        value: Record<string, any>;
        types: Record<string, Record<string, string>>;
        effectRun: Record<string, true>;
        tree: Record<string, {
            childs: Set<string>;
            parent_id: string;
        }>;
        evargs: Record<string, {
            local: any;
            passprop: any;
            passchild: any;
        }>;
    };
}
declare module "utils/ui/box" {
    import { FC, ReactElement, ReactNode } from "react";
    type ItemBtn = {
        content: ReactNode;
        tooltip?: ReactNode;
        disabled?: boolean;
        onClick?: () => void;
        className?: string;
    };
    export const ToolbarBox: FC<{
        label?: ReactNode;
        labelMenu?: {
            label: ReactNode;
            onClick?: () => void | Promise<void>;
        }[];
        items: (ReactElement | ItemBtn | undefined)[];
        className?: string;
    }>;
}
declare module "utils/ui/deadend" {
    import { FC } from "react";
    export const DeadEnd: FC<{
        children: any;
        back?: () => void;
    }>;
}
declare module "utils/ui/selection" {
    export function setSelectionOffset(node: Node, start: number, end: number): void;
    export function getSelectionOffset(container: Node): [number, number];
    export function getInnerText(container: Node): string;
}
declare module "utils/ui/icons/code" {
    import { SVGAttributes } from "react";
    export function CodeIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/database" {
    import { SVGAttributes } from "react";
    export function DatabaseIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/etc" {
    export const IconNoImage: (props: any) => import("react/jsx-runtime").JSX.Element;
    export const IconLeftArrow: (props: any) => import("react/jsx-runtime").JSX.Element;
    export const IconRightArrow: (props: any) => import("react/jsx-runtime").JSX.Element;
    export const BurgerIcon: () => import("react/jsx-runtime").JSX.Element;
    export const CloseIcon: ({ className }: {
        className?: string;
    }) => import("react/jsx-runtime").JSX.Element;
    export const IconLoading: (props: any) => import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/field" {
    import { SVGAttributes } from "react";
    export function FieldIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/gear" {
    import { SVGAttributes } from "react";
    export function GearIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/home" {
    import { SVGAttributes } from "react";
    export function HomeIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/link" {
    import { SVGAttributes } from "react";
    export function LinkIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/menu" {
    import { SVGAttributes } from "react";
    export function MenuIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/pencil" {
    import { SVGAttributes } from "react";
    export function PencilSquareIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/receipt-back" {
    import { SVGAttributes } from "react";
    export function ReceiptBackIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/star" {
    import { SVGAttributes } from "react";
    export function StarIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/unwrap" {
    import { SVGAttributes } from "react";
    export function UnwrapIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/url" {
    import { SVGAttributes } from "react";
    export function URLIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ui/icons/wrap" {
    import { SVGAttributes } from "react";
    export function WrapIcon(props: SVGAttributes<SVGElement>): import("react/jsx-runtime").JSX.Element;
}
