import { jscript } from "../jscript";
import { SimpleVisitors } from "./acorn-types";
import BaseVisitor from "./base-visitor";

export function traverse<T = unknown>(
  ast: ReturnType<Exclude<typeof jscript.parse, null>>["program"],
  visitors: SimpleVisitors<T>,
  state?: T
) {
  const baseVisitor = new BaseVisitor();
  try {
    simpleWalk(ast, visitors, baseVisitor, state);
  } catch (e) {
    console.log(e);
  }
}

function simpleWalk<TState>(
  node: any,
  visitors: any,
  baseVisitor: any,
  state?: TState,
  override?: string
) {
  (function c(node, st, override) {
    if (node) {
      let type = override || node.type;
      if (typeof baseVisitor[type] === "function") {
        baseVisitor[type](node, st, c);
      } else {
        console.error("Warning Parser Node Type Not Found: " + (type || node));
      }
      if (visitors[type]) visitors[type](node, st);
    }
  })(node, state, override);
}
