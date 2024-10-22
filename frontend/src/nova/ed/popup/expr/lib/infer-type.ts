import { EType } from "popup/vars/lib/type";
import { getExpressionDefinition } from "../parts/all-expr";
import { EDeepType, EOutputType, PExpr } from "./types";
import { PG } from "logic/ed-global";
import { getVarDef } from "./var-def";

export const inferType = (arg: {
  p: PG;
  expr: PExpr;
  item_id: string;
  prev?: EDeepType[];
}): EDeepType[] => {
  const { expr, item_id, p, prev } = arg;
  if (expr.kind === "static") {
    return [{ simple: expr.type, type: expr.type }];
  } else if (expr.kind === "expr") {
    const def = getExpressionDefinition(expr.name);
    if (def) {
      return def.infer({ p, current: expr, item_id, prev: prev || [] });
    }
  } else if (expr.kind === "var" && expr.var) {
    const def = getVarDef(p, expr.var);
    if (def) {
      return [{ simple: simplifyType(def.type), type: def.type }];
    }
  }

  return [];
};

export const simplifyType = (type: EType): EOutputType => {
  if (typeof type === "string") {
    return type;
  }

  if (type === null) return "null";
  if (Array.isArray(type)) return "array";
  return "object";
};
