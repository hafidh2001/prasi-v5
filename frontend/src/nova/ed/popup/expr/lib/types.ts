import { EBaseType, ESimpleType, EType } from "popup/vars/lib/type";
import { FC } from "react";
import { VarUsage } from "utils/types/item";

export type PExprFields = Record<
  string,
  | { kind: "expression"; type?: EBaseType }
  | { kind: "options"; options: string[] }
>;

export type PExprDefinition<T extends PExprFields> = {
  name: string;
  fields: T;
  Component: FC<{ props: T }>;
  evaluate: (current: PTypedExpr<T>) => { value: any; type: EType };
};

export const defineExpression = <T extends PExprFields>(
  expr: PExprDefinition<T>
) => {
  return expr;
};

export type PExpr =
  | ESimpleType
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
