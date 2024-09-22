import { DeepReadonly } from "popup/script/flow/runtime/types";
import { produceCSS } from "utils/css/gen";
import { IItem } from "utils/types/item";

type PROPS = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const viDivProps = (
  item: DeepReadonly<IItem>,
  opt: { mode: "desktop" | "mobile" }
) => {
  const props: PROPS & { inherit?: { style: IItem; className: string } } = {
    className: produceCSS(item as any, {
      mode: opt.mode,
    }),
  };

  delete props.children;

  if (item.adv?.html) {
    props.dangerouslySetInnerHTML = { __html: item.adv?.html };
  }

  return props;
};
