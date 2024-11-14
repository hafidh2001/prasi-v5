import { Resizable } from "re-resizable";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { IRoot } from "utils/types/root";
import { LoadingSpinner } from "utils/ui/loading";
import { validate } from "uuid";
import { ViPage } from "vi/vi-page";

const cache = {} as Record<string, IRoot>;

export const CPrasi: FC<{ id: string; size?: string; name: string }> = ({
  id,
  size,
  name,
}) => {
  const local = useLocal(
    {
      root: cache[id],
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
            cache[id] = local.root;
          }
        }

        local.render();
      };
      local.load();
    }
  );

  const content = local.root ? (
    <ViPage
      init={{
        name,
        page: { root: local.root, id, url: "" },
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
