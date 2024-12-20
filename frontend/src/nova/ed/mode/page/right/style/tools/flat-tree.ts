import find from "lodash.find";
import get from "lodash.get";
import set from "lodash.set";
import { deepClone } from "utils/react/use-global";
import { IItem } from "utils/types/item";

export const flatTree = (item: Array<IItem>) => {
  const children = item as Array<IItem>;
  let ls = deepClone(item);
  let sitem: any = ls.map((v: IItem) => {
    if (v.type !== "text") {
      v.childs = [];
    }
    return { ...v };
  });
  let result = [] as any;
  sitem.forEach((v: IItem) => {
    let parent = children.filter((x: IItem) =>
      find(get(x, "childs"), (x: IItem) => x.id === v.id)
    );
    if (get(parent, "length")) {
      let s = sitem.find((e: any) => e.id === get(parent, "[0].id"));
      let childs: any = s.childs || [];
      childs = childs.filter((e: any) => get(e, "id")) || [];
      let now = [v];
      set(s, "childs", childs.concat(now));
    } else {
      result.push(v);
    }
  });
  return result;
};
