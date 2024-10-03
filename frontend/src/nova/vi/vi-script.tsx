import { DeepReadonly } from "popup/script/flow/runtime/types";
import { FC, ReactElement, useRef } from "react";
import { IItem } from "utils/types/item";
import { compArgs } from "./lib/comp-args";
import { parentCompArgs } from "./lib/parent-comp-args";
import { scriptArgs } from "./lib/script-args";
import { useVi } from "./lib/store";
import { createViLocal } from "./script/vi-local";
import { __localname, parentLocalArgs } from "./lib/parent-local-args";

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
  const { ref_comp_props, parents, db, api, local_parents } = useVi(
    ({ ref }) => ({
      ref_comp_props: ref.comp_props,
      parents: ref.item_parents,
      db: ref.db,
      api: ref.api,
      local_parents: ref.local_value,
    })
  );

  const internal = useRef<any>({}).current;
  const result = { children: null };
  const script_args = scriptArgs({ item, childs, props, result });

  if (item !== internal.item) {
    internal.item = item;
    internal.Local = createViLocal(item, ref_comp_props);
  }

  let comp_args = parentCompArgs(parents, ref_comp_props, item.id);
  let local_args = parentLocalArgs(local_parents, parents, item.id);

  if (item.component?.id) {
    ref_comp_props[item.id] = compArgs(item, comp_args, db, api);
    comp_args = ref_comp_props[item.id];
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
    db,
    api,
    __js: item.adv!.js,
    __localname,
    defineLocal(arg: { name: string; value: any }) {
      arg.value[__localname] = arg.name;
      return arg.value;
    },
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
