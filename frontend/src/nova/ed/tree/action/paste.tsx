import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { fillID } from "logic/fill-id";
import { IItem } from "utils/types/item";

export const edActionPaste = async (p: PG, item: IItem) => {
  const res = await navigator.clipboard.readText();
  if (typeof res === "string" && res.startsWith("prasi-clipboard:")) {
    const clip = JSON.parse(res.substring("prasi-clipboard:".length)) as IItem;
    getActiveTree(p).update(({ findNode }) => {
      const node = findNode(item.id);
      if (node) {
        if (item.type === "text") {
          if (node.parent) {
            const parent = findNode(node.parent.id);
            if (parent) {
              let idx = 0;
              for (const child of parent.item.childs) {
                if (child.id === item.id) {
                  const new_item = fillID(clip);
                  parent.item.childs.splice(idx + 1, 0, new_item);
                  break;
                }
                idx++;
              }
            }
          }
        } else {
          const new_item = fillID(clip);
          node.item.childs.push(new_item);
        }
      }
    });
  }
};
