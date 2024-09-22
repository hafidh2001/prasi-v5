import { ErrorBox } from "./lib/error-box";
import { useVi } from "./lib/store";
import { ViRender } from "./vi-render";

export const ViRoot = () => {
  const { page, layout } = useVi(({ state, ref }) => ({
    page: state.page,
    layout: state.layout,
  }));

  const is_layout = !!layout?.content_tree;
  const content_tree = is_layout ? layout?.content_tree : page?.content_tree;

  return (
    <div className="flex flex-1 flex-col relative">
      {Array.isArray(content_tree?.childs) &&
        content_tree.childs.map((item) => {
          return (
            <ErrorBox key={item.id}>
              <ViRender item={item} is_layout={is_layout} />
            </ErrorBox>
          );
        })}
    </div>
  );
};
