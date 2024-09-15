import { createId } from "@paralleldrive/cuid2";
import { parsePropForJsx } from "crdt/node/flatten-tree";
import { decorateEComp } from "crdt/node/load-child-comp";
import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { deepClone } from "utils/react/use-global";
import { IItem } from "utils/types/item";

export const edActionWrap = (p: PG, item: IItem) => {
  getActiveTree(p).update(({ findParent }) => {
    const parent = findParent(item.id);
    if (parent) {
      let i = 0;
      for (const child of parent.item.childs) {
        if (child.id === item.id) {
          const new_item: IItem = {
            id: createId(),
            name: `Wrapped`,
            type: "item",
            childs: [item],
          };
          parent.item.childs.splice(i, 1, new_item);
        }
        i++;
      }
    }
  });
};

export const edActionWrapInComp = (p: PG, item: IItem) => {
  p.ui.popup.comp.on_pick = async (comp_id) => {
    let comp = p.comp.loaded[comp_id];
    if (!comp && p.sync) {
      const result = await p.sync.comp.load([comp_id]);
      if (result[comp_id]) {
        p.comp.loaded[comp_id] = decorateEComp(result[comp_id]);
        comp = p.comp.loaded[comp_id];
      } else {
        alert("Failed to load component: " + comp_id);
        return;
      }
    }

    const jsx_props = parsePropForJsx(comp.content_tree);
    const jsx_names = Object.keys(jsx_props);
    let jsx_name = "";
    if (jsx_names.length === 0) {
      alert(`Failed to wrap, Component does not have child`);
      return;
    } else {
      if (jsx_names.includes("child")) jsx_name = "child";
      else jsx_name = jsx_names.shift() || "";
    }

    if (!jsx_name) {
      alert(`Failed to wrap, Component does not have child`);
      return;
    }

    const new_item: IItem = {
      id: createId(),
      name: `Wrapped`,
      type: "item",
      childs: [item],
      component: {
        id: comp_id,
        props: {
          [jsx_name]: {
            content: deepClone(item),
            value: "",
            meta: { type: "content-element" },
          },
        },
      },
    };

    if (new_item) {
      getActiveTree(p).update(({ findParent }) => {
        const parent = findParent(item.id);
        if (parent) {
          let i = 0;
          for (const child of parent.item.childs) {
            if (child.id === item.id) {
              if (item.type === "item" && item.childs.length > 0) {
                parent.item.childs.splice(i, 1, new_item);
              }
            }
            i++;
          }
        }
      });
    }
  };
  p.render();
};
