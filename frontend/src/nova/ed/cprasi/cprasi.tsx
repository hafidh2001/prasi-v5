import { Resizable } from "re-resizable";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { IRoot } from "utils/types/root";
import { LoadingSpinner } from "utils/ui/loading";
import { validate } from "uuid";
import { ViComps } from "vi/lib/types";
import { ViPage } from "vi/vi-page";
import { _prasi } from "./_prasi";

const page_cache = {} as Record<string, IRoot>;
const component_cache = {} as ViComps;

export const CPrasi: FC<{ id: string; size?: string; name: string }> = ({
  id,
  size,
  name,
}) => {
  const local = useLocal(
    {
      root: page_cache[id],
      load: async () => {},
      size: localStorage.getItem("prasi-size-" + name) || size,
    },
    async () => {
      local.load = async () => {
        if (validate(id)) {
          const page = await _db.page.findFirst({
            where: { id },
            select: { content_tree: true },
          });
          if (page) {
            local.root = page.content_tree as any;
            page_cache[id] = local.root;
            if (local.root.component_ids) {
              const pending_ids = local.root.component_ids.filter(
                (e) => !component_cache[e]
              );
              if (pending_ids.length > 0) {
                const comps = await _db.component.findMany({
                  where: {
                    id: {
                      in: pending_ids,
                    },
                  },
                  select: { id: true, content_tree: true },
                });
                for (const comp of comps) {
                  component_cache[comp.id] = comp.content_tree as any;
                }
              }
            }
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
    <ViPage
      init={{
        name,
        page: { root: local.root, id, url: "" },
        comps: component_cache,
        exports: { _prasi: _prasi },
      }}
    />
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
