import { EDGlobal } from "logic/ed-global";
import { Resizable } from "re-resizable";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IRoot } from "utils/types/root";
import { LoadingSpinner } from "utils/ui/loading";
import { validate } from "uuid";
import { ViComps } from "vi/lib/types";
import { ViPage } from "vi/vi-page";
import { prasi } from "./lib/prasi";
import { waitUntil } from "prasi-utils";

const cache = {
  page: {} as Record<string, IRoot>,
  component: {} as ViComps,
  vsc: { loaded: false, loading: false },
};

export const CPrasi: FC<{ id: string; size?: string; name: string }> = ({
  id,
  size,
  name,
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal(
    {
      root: cache.page[id],
      load: async () => {},
      size: localStorage.getItem("prasi-size-" + name) || size,
    },
    async () => {
      if (!cache.vsc.loaded) {
        if (!cache.vsc.loading) {
          cache.vsc.loading = true;
          const fn = new Function(
            `return import('/prod/prasi/psc/js/index.js');`
          );
          console.log(await fn());
        }
        await waitUntil(() => cache.vsc.loaded);
      }

      local.load = async () => {
        if (validate(id)) {
          const bin = await _api._cprasi(id, {
            exclude: Object.keys(cache.component),
          });
          local.root = bin.page.content_tree;
          cache.page[id] = local.root;
          for (const comp of bin.comps) {
            cache.component[comp.id] = comp.content_tree as any;
          }
        }

        local.render();
      };
      if (!cache.page[id] || location.hostname === "localhost") {
        local.load();
      }
    }
  );

  const content = local.root ? (
    <div className="flex flex-1 flex-col text-[15px]">
      <ViPage
        init={{
          name,
          page: { root: local.root, id, url: "" },
          comps: cache.component,
          exports: { prasi },
        }}
      />
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center w-full h-full">
      <LoadingSpinner size={17} />
    </div>
  );

  if (size) {
    const w = local.size?.split("x")[0];
    const h = local.size?.split("x")[1];
    return (
      <Resizable
        className="flex-1 flex"
        defaultSize={{ width: w, height: h }}
        onResizeStop={(_, __, div) => {
          localStorage.setItem(
            "prasi-size-" + name,
            div.clientHeight.toString() + "x" + div.clientWidth.toString()
          );
        }}
      >
        {content}
      </Resizable>
    );
  }

  return content;
};
