import { operators } from "../operator/operators";

export type EString = { type: "string"; value: string };
export type ENumber = { type: "number"; value: number };
export type EBoolean = { type: "boolean"; value: boolean };
export type ENull = { type: "null"; value: null };
export type EArray = { type: EArrayType; value: EValue[] };
export type EObject = {
  type: EObjectType;
  value: { [key: string]: EValue };
};

export type EType = ESimpleType | EArrayType | EObjectType;
export type ESimpleType = "string" | "number" | "boolean" | "null";
export type EBaseType = ESimpleType | "array" | "object";
export type EArrayType = [EType];
export type EObjectType = { [K in string]: { type: EType; idx: number } };

export type EValue = EArray | EObject | EString | ENumber | EBoolean | ENull;

export type EOperatorType = {
  base: EBaseType;
  syntax: string;
  
  operand?: Record<string, EBaseType>;
  output: EBaseType;
  process: (...arg: EValue[]) => EValue;
};

export type EOperator = keyof typeof operators;

export type EVar = {
  type: "variable";
  name: string;
  typings: EType;
  resolve: () => EValue;
};

export type EExpr = {
  type: "expression";
  base: EVar | EValue | EExpr;
  operator?: EOperator;
  operands?: (EVar | EValue | EExpr)[];
};

export type PEInitProp = (arg: {
  focus: () => void;
  on: {
    blur: () => void;
    focus: () => void;
    paste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  };
}) => void;
