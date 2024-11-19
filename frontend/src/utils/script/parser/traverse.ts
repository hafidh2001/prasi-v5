import { walk } from "estree-walker";
import { jscript } from "../jscript";

export function traverse<T = unknown>(
  ast: ReturnType<Exclude<typeof jscript.parse, null>>["program"],
  visitors: Record<string, (arg: any) => void>,
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
