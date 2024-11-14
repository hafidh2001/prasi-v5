import { DeepReadonly } from "popup/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";
import { ErrorBox } from "./lib/error-box";
import { useVi } from "./lib/store";
import { ViPageRoot } from "./lib/types";
import { ViRender } from "./vi-render";

export const ViPage: FC<{ init?: { page: ViPageRoot; name: string } }> = ({
  init,
}) => {
  const { layout, parents, ref } = useVi(
    ({ ref }) => ({
      page: ref.page,
      layout: ref.layout,
      parents: ref.item_parents,
      ref,
    }),
    init?.name
  );

  let page = ref.page;
  if (init?.page) {
    ref.page = init.page;
    page = ref.page;
  }

  const is_layout = !!layout?.root;
  const content_tree = (is_layout
    ? layout?.root
    : page?.root) as unknown as DeepReadonly<IItem>;

  return (
    <div className="flex flex-1 flex-col relative">
      {Array.isArray(content_tree?.childs) &&
        content_tree.childs.map((item: DeepReadonly<IItem>) => {
          parents[item.id] = "root";

          return (
            <ErrorBox key={item.id}>
              <ViRender item={item} is_layout={is_layout} />
            </ErrorBox>
          );
        })}
    </div>
  );
};
