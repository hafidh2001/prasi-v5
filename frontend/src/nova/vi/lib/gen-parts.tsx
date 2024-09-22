import { produceCSS } from "utils/css/gen";
import { IItem } from "utils/types/item";

type PROPS = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const viDivProps = (
  item: IItem,
  opt: { mode: "desktop" | "mobile" }
) => {
  const props: PROPS & { inherit?: { style: IItem; className: string } } = {
    className: produceCSS(item, {
      mode: opt.mode,
    }),
  };

  delete props.children;

  if (item.adv?.html) {
    props.dangerouslySetInnerHTML = { __html: item.adv?.html };
  }

  return props;
};
