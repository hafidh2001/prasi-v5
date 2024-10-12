import { EType } from "popup/vars/lib/type";
import { PExpr } from "./types";
import { allExpression } from "../list/all-expr";

export const evalExpr = (expr: PExpr): { value: any; type: EType } => {
  if (typeof expr === "object") {
    if (!expr) {
      return { value: null, type: "null" };
    }

    //todo: eval array expr
    if (Array.isArray(expr)) {
      return { value: null, type: "null" };
    }

    //todo: eval var expr
    if (expr.kind === "var") {
      return { value: null, type: "null" };
    }

    const found = allExpression.find((e) => e.name === expr.name);
    if (found) return found.evaluate(expr as any);
  }

  if (typeof expr === "number") return { value: expr, type: "number" };
  if (typeof expr === "string") return { value: expr, type: "string" };

  return { value: null, type: "null" };
};
