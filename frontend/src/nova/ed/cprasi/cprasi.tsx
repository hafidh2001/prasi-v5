import { Resizable } from "re-resizable";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { IRoot } from "utils/types/root";
import { LoadingSpinner } from "utils/ui/loading";
import { validate } from "uuid";
import { ViComps } from "vi/lib/types";
import { ViPage } from "vi/vi-page";
import { prasi } from "./prasi";
import { useGlobal } from "utils/react/use-global";
import { EDGlobal } from "logic/ed-global";
import { unpack } from "msgpackr";
const page_cache = {} as Record<string, IRoot>;
const component_cache = {} as ViComps;

export const CPrasi: FC<{ id: string; size?: string; name: string }> = ({
  id,
  size,
  name,
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal(
    {
      root: page_cache[id],
      load: async () => {},
      size: localStorage.getItem("prasi-size-" + name) || size,
    },
    async () => {
      local.load = async () => {
        if (validate(id)) {
          const bin = await _api._cprasi(id, {
            exclude: Object.keys(component_cache),
          });
          local.root = bin.page.content_tree;
          page_cache[id] = local.root;
          for (const comp of bin.comps) {
            component_cache[comp.id] = comp.content_tree as any;
          }
        }

        local.render();
      };
      if (!page_cache[id] || location.hostname === "localhost") {
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
          comps: component_cache,
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
