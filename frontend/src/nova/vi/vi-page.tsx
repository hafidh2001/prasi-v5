import { DeepReadonly } from "popup/flow/runtime/types";
import { ErrorBox } from "./lib/error-box";
import { useVi } from "./lib/store";
import { ViRender } from "./vi-render";
import { IItem } from "utils/types/item";

export const ViPage = () => {
  const { page, layout, parents } = useVi(({ state, ref }) => ({
    page: state.page,
    layout: state.layout,
    parents: ref.item_parents,
  }));

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
