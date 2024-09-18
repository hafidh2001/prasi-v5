import { ReactElement } from "react";
import { allNodeDefinitions } from "./nodes";

export type PFNodeID = string;

export type PFNodeBranch = {
  code?: string;
  name?: string;
  flow: PFNodeID[];
  idx?: number;
};

export type PFNodePosition = { x: number; y: number };
export type PFNodeSize = { w?: number; h?: number };

export type PFNodeType = keyof typeof allNodeDefinitions;
export type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

export type PFNode = Record<string, any> & {
  id: string;
  name?: string;
  type: string;
  vars?: Record<string, any>;
  branches?: PFNodeBranch[];
  position?: PFNodePosition;
  size?: PFNodeSize;
  unused_branches?: PFNodeBranch[];
};

export type RPFlow = DeepReadonly<PFlow>;

export type PFlow = {
  id: string;
  name: string;
  path?: string;
  nodes: Record<PFNodeID, PFNode>;
  flow: Record<string, PFNodeID[]>;
};

export type PFNodeRuntime<T extends Record<string, any>> = {
  current: PFNode & T;
  prev?: PFNode;
  first: PFNode;
  visited: { node: PFNode; branch?: PFNodeBranch }[];
};

export type PFRuntime = {
  nodes: PFNode[];
};

export type PFNodeDefinition<F extends Record<string, PFField>> = {
  type: string;
  className?: string;
  vars?: Record<string, any>;
  icon: string;
  on_before_connect?: (arg: {
    node: PFNode;
    is_new: boolean;
    pflow: PFlow;
  }) => void;
  on_after_connect?: (arg: { from: PFNode; to: PFNode }) => void;
  on_init?: (arg: {
    node: PFNode;
    flow: PFNodeID[];
    nodes: Record<string, PFNode>;
  }) => void;
  process: (arg: {
    vars: Record<string, any>;
    node: PFNodeRuntime<{ [K in keyof F]: F[K] }>;
    processBranch: (branch: PFNodeBranch) => Promise<void>;
    next: () => void;
    console: typeof console;
  }) => void | Promise<void>;
  fields?: F;
};

export type PFField = (
  | { type: "string" }
  | {
      type: "array";
      fields: Record<string, PFField>;
      render: (arg: { node: PFNode; save: () => void }) => ReactElement;
      add?: {
        checkbox: () => { label: string; value: any; checked?: boolean }[];
        onChange: (checked: any[]) => void;
      };
    }
  | { type: "code" }
  | {
      type: "options" | "buttons";
      multiple?: boolean;
      options: () => Promise<
        (string | { value: string; label: string; el?: ReactElement })[]
      >;
    }
) & { idx: number; label: string; optional?: boolean; className?: string };