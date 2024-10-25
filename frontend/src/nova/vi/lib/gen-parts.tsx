import { DeepReadonly } from "popup/flow/runtime/types";
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
  if (item.adv?.tailwind) {
    let s = document.querySelector(`style#${item.id}`);
    if (!s) {
      s = document.createElement("style");
      s.id = item.id;
      document.head.appendChild(s);
    }
    s.innerHTML = item.adv.tailwind;
  }

  const props: DIV_PROPS & { inherit?: { style: IItem; className: string } } = {
    ...(opt?.div_props || {}),
    className: cx(
      produceCSS(item as any, {
        mode: opt.mode,
      }),
      item.type === "text" && !item.adv?.js ? "text-block" : "",
      opt?.div_props?.className
    ),
  };

  delete props.children;

  if (item.adv?.html) {
    props.dangerouslySetInnerHTML = { __html: item.adv?.html };
  }

  return props;
};
