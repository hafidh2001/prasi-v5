import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC, ReactElement, useRef } from "react";
import { IItem } from "utils/types/item";
import { compArgs } from "./lib/comp-args";
import { parentCompArgs } from "./lib/parent-comp-args";
import { __localname, parentLocalArgs } from "./lib/parent-local-args";
import { parentPassProps } from "./lib/parent-pass-props";
import { scriptArgs } from "./lib/script-args";
import { useVi } from "./lib/store";
import { createViLocal } from "./script/vi-local";
import { createViPassProp } from "./script/vi-pass-prop";

export const ViScript: FC<{
  item: DeepReadonly<IItem>;
  childs: ReactElement | null;
  props: React.ClassAttributes<HTMLDivElement> &
    React.HTMLAttributes<HTMLDivElement> & {
      inherit?: {
        style: IItem;
        className: string;
      };
    };
  ts?: number;
}> = ({ item, childs, props }) => {
  const {
    comp_props_parents,
    pass_props_parents,
    parents,
    db,
    api,
    local_parents,
  } = useVi(({ ref }) => ({
    comp_props_parents: ref.comp_props,
    parents: ref.item_parents,
    db: ref.db,
    api: ref.api,
    local_parents: ref.local_value,
    pass_props_parents: ref.pass_prop_value,
  }));

  const internal = useRef<any>({}).current;
  const result = { children: null };
  const script_args = scriptArgs({ item, childs, props, result });

  if (item !== internal.item) {
    internal.item = item;
    internal.Local = createViLocal(item, local_parents);
    internal.PassProp = createViPassProp(item, pass_props_parents);
  }

  let comp_args = parentCompArgs(parents, comp_props_parents, item.id);
  let local_args = parentLocalArgs(local_parents, parents, item.id);
  let passprops_args = parentPassProps(pass_props_parents, parents, item.id);

  if (item.component?.id) {
    comp_props_parents[item.id] = compArgs(item, comp_args, db, api);
    comp_args = comp_props_parents[item.id];
  }

  for (const [k, v] of Object.entries(comp_args)) {
    if (typeof v === "object" && (v as any).__jsx) {
      comp_args[k] = (v as any).__render(item, parents);
    }
  }

  const final_args = {
    ...comp_args,
    ...script_args,
    ...local_args,
    ...passprops_args,
    db,
    api,
    __js: item.adv!.js,
    __localname,
    defineLocal(arg: { name: string; value: any }) {
      arg.value[__localname] = arg.name;
      return arg.value;
    },
    PassProp: internal.PassProp,
  };
  final_args.Local = internal.Local;

  const src = item.adv!.jsBuilt || "";
  const fn = new Function(
    ...Object.keys(final_args),
    `// ${item.name}: ${item.id} 
try {
  ${src}
} catch (e) {
  console.error(\`\\
Error in item ${item.name}: ${item.id} 

$\{__js}

ERROR: $\{e.message}
\`);
}`
  );

  try {
    fn(...Object.values(final_args));

    return result.children;
  } catch (e) {
    console.log(fn);
    throw e;
  }
};
