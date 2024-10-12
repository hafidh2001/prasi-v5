import { EBaseType, ESimpleType, EType } from "popup/vars/lib/type";
import { FC } from "react";
import { VarUsage } from "utils/types/item";

type EXPR_NAME = string;

export type PExprFields = Record<
  string,
  | {
      kind: "expression";
      output_type?: EBaseType;
      optional?: boolean;
      only_expr?: EXPR_NAME[];
    }
  | { kind: "options"; options: string[]; optional?: boolean }
>;

export type PExprDefinition<T extends PExprFields> = {
  name: EXPR_NAME;
  fields: T;
  group: string;
  Component: FC<{ props: T }>;
  evaluate: (current: PTypedExpr<T>) => { value: any; type: EType };
};

export const defineExpression = <T extends PExprFields>(
  expr: PExprDefinition<T>
) => {
  return expr;
};

export type PExpr =
  | { kind: "static"; value: any }
  | { kind: "var"; var: VarUsage }
  | {
      kind: "expr";
      name: string;
      expr: Record<string, PExpr>;
    };

export type PTypedExpr<T extends PExprFields> = {
  name: string;
  expr: {
    [K in keyof T]: T[K]["kind"] extends "expression" ? PExpr : any;
  };
};
