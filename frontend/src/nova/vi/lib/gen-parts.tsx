import { DeepReadonly } from "popup/script/flow/runtime/types";
import { produceCSS } from "utils/css/gen";
import { IItem } from "utils/types/item";

export type DIV_PROPS = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const viDivProps = (
  item: DeepReadonly<IItem>,
  opt: { mode: "desktop" | "mobile"; div_props?: DIV_PROPS }
) => {
  const props: DIV_PROPS & { inherit?: { style: IItem; className: string } } = {
    ...(opt?.div_props || {}),
    className: cx(
      produceCSS(item as any, {
        mode: opt.mode,
      }),
      opt?.div_props?.className
    ),
  };

  delete props.children;

  if (item.adv?.html) {
    props.dangerouslySetInnerHTML = { __html: item.adv?.html };
  }

  return props;
};
