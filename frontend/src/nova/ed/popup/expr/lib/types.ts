import { EBaseType, ESimpleType, EType } from "popup/vars/lib/type";
import { FC } from "react";
import { VarUsage } from "utils/types/item";

export type EXPR_NAME = string;

export type PExprField =
  | {
      kind: "expression";
      expected_type?: EBaseType;
      optional?: boolean;
      multiple?: boolean;
      label: string;
      desc?: string;
      only_expr?: EXPR_NAME[];
    }
  | { kind: "options"; options: string[]; optional?: boolean };
export type PExprFields = Record<string, PExprField>;

export type EOutputType = ESimpleType | "any";
export type PExprDefinition<T extends PExprFields> = {
  name: EXPR_NAME;
  label: string;
  fields: T;
  group: string;
  desc: string;
  output_type: Readonly<EOutputType>;
  Component: FC<{
    name: EXPR_NAME;
    expr: PTypedExpr<T>["expr"];
    expected_type?: EOutputType[];
  }>;
  evaluate: (current: PTypedExpr<T>) => { value: any; type: EType };
};

export const defineExpression = <T extends PExprFields>(
  expr: PExprDefinition<T>
) => {
  return expr;
};

export type PExpr =
  | { kind: "static"; value: any; type: ESimpleType }
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
