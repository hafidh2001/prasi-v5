import { rapidhash_fast } from "crdt/node/rapidhash";
import { DeepReadonly } from "popup/flow/runtime/types";
import { waitUntil } from "prasi-utils";
import React, { FC, ReactElement, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { useSnapshot } from "valtio";
import { ErrorBox } from "./lib/error-box";
import { parentCompArgs } from "./lib/parent-comp-args";
import { scriptArgs } from "./lib/script-args";
import { useVi } from "./lib/store";
import { ViMergedProps } from "./lib/types";
import { IF } from "./script/vi-if";
import { createViLocal, local_name, render_mode } from "./script/vi-local";
import { createViLoop } from "./script/vi-loop";
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
  merged?: ViMergedProps;
  instance_id?: string;
  render: () => void;
}> = ({ item, childs, props, merged, render }) => {
  const internal = useLocal({
    Local: undefined as any,
    PassProp: undefined as any,
    Loop: undefined as any,
    item: undefined as any,
    ScriptComponent: null as any,
    watch_auto_render: {} as Record<string, any>,
    arg_hash: "",
    value: {} as Record<string, any>,
  });
  const {
    comp_props_parents,
    parents,
    db,
    api,
    cache_js,
    local_render,
    dev_item_error: dev_item_error,
    dev_tree_render,
  } = useVi(({ ref }) => ({
    comp_props_parents: ref.comp_props,
    parents: ref.item_parents,
    db: ref.db,
    api: ref.api,
    cache_js: ref.cache_js,
    local_render: ref.local_render,
    dev_item_error: ref.dev_item_error,
    dev_tree_render: ref.dev_tree_render,
  }));

  local_render[item.id] = render;
  const result = { children: null as any };
  const script_args = scriptArgs({ item, childs, props, result });

  const _merged: ViMergedProps = {
    ...merged,
    __internal: { ...merged?.__internal },
  };

  const valtio_snapshot = {} as Record<string, any>;

  if (internal.item !== item) {
    internal.item = item;
    internal.Local = createViLocal(item, internal.value, local_render, _merged);
    internal.PassProp = createViPassProp(item, _merged);
    internal.Loop = createViLoop(item, childs, _merged);
    if (internal.watch_auto_render) {
      for (const cleanupAutoDispatch of Object.values(
        internal.watch_auto_render
      )) {
        cleanupAutoDispatch();
      }
    }
    internal.watch_auto_render = {};
  }

  for (const [k, v] of Object.entries(_merged)) {
    if (v.__autorender && v.proxy && v.__item_id !== item.id) {
      valtio_snapshot[k] = useSnapshot(v.proxy);
      // this is a hack to make valtio only watch accessed properties
      // and not all properties of the object
      valtio_snapshot[k].__autorender;
    }
  }

  useEffect(() => {
    return () => {
      for (const cleanup of Object.values(internal.watch_auto_render)) {
        cleanup();
      }
    };
  }, []);

  const comp_args = parentCompArgs(parents, comp_props_parents, item.id);

  for (const [k, v] of Object.entries(comp_args)) {
    if (typeof v === "object" && v && (v as any).__jsx) {
      comp_args[k] = (v as any).__render(item, parents);
    }
  }

  const defineLocal = (arg: {
    name: string;
    value: any;
    render_mode: "auto" | "manual";
  }) => {
    arg.value[local_name] = arg.name;
    arg.value[render_mode] = arg.render_mode;
    if (arg.render_mode === "auto") {
      arg.value.set = new Proxy(
        {},
        {
          get(target, p, receiver) {
            return internal.value[arg.name]?.proxy?.[p];
          },
        }
      );
    } else {
      arg.value.render = render;
    }
    return arg.value;
  };

  const defineLoop = (arg: { list: any[]; loop_name: string }) => {
    return arg;
  };

  const final_args = {
    ...comp_args,
    ...script_args,
    ..._merged,
    ...valtio_snapshot,
    db,
    api,
    __js: removeRegion(item.adv!.js || ""),
    defineLocal,
    defineLoop,
    PassProp: internal.PassProp,
    Local: internal.Local,
    Loop: internal.Loop,
    React,
    IF,
    __result: result,
    createElement: function (...arg: any[]) {
      if (arg && Array.isArray(arg) && arg[0] === internal.PassProp && arg[1]) {
        if (!arg[1].idx && arg[1].key) {
          arg[1].idx = arg[1].key;
        } else if (arg[1].idx && !arg[1].key) {
          arg[1].key = arg[1].idx;
        }
      }

      return (React.createElement as any)(...arg);
    },
  };

  const arg_hash = rapidhash_fast(Object.keys(final_args).join("-")).toString();
  const isEditor = (window as any).isEditor as boolean;

  if (!internal.ScriptComponent || internal.arg_hash !== arg_hash) {
    let src = (item.adv!.jsBuilt || "").replace(
      /React\.createElement/g,
      "createElement"
    );
    if (!isEditor) {
      src = `\
try {  
  ${src}\
} catch(e) {
  console.error(e);
}`;
    }

    let src_fn = "";

    src_fn = `\
// ${item.name}: ${item.id} 

${Object.keys(final_args)
  .map((e) => {
    return `const ${e} = p.${e}`;
  })
  .join(";\n")}

{
  ${src}\
}

return __result.children;
`;

    internal.ScriptComponent = new Function("p", src_fn);
    internal.arg_hash = arg_hash;
  }
  final_args.__src = item.adv!.js;
  if (!isEditor) {
    return <internal.ScriptComponent {...final_args} />;
  }

  return (
    <ErrorBox
      silent={true}
      error_jsx={isEditor ? undefined : null}
      onError={async (e) => {
        if (isEditor) {
          dev_item_error[item.id] = e;
          waitUntil(() => dev_tree_render[item.id]).then(() => {
            if (dev_tree_render[item.id]) dev_tree_render[item.id]();
          });
        }
      }}
    >
      <internal.ScriptComponent {...final_args} />
    </ErrorBox>
  );
};

const removeRegion = (src: string) => {
  if (src.startsWith("// #region")) {
    const end = src.indexOf("// #endregion");
    return src.substring(end + 13).trim();
  }
};
