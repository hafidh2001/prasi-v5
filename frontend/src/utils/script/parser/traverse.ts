import { walk } from "estree-walker";
import { jscript } from "../jscript";
import { SimpleVisitors } from "./acorn-types";

export function traverse<T = unknown>(
  ast: ReturnType<Exclude<typeof jscript.parse, null>>["program"],
  visitors: SimpleVisitors<T>,
  state?: T
) {
  walk(ast as any, {
    enter(node, parent, prop, index) {
      const fn = (visitors as any)[node.type];
      if (fn) {
        fn(node);
      }
    },
  });
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
        const proto = Object.getPrototypeOf(baseVisitor);
        console.log(proto);
        if (typeof proto[type] === "function") {
          proto[type](node, st, c);
        } else {
          console.error(
            "Warning Parser Node Type Not Found: " + (type || node),
            baseVisitor
          );
        }
      }
      if (visitors[type]) visitors[type](node, st);
    }
  })(node, state, override);
}
