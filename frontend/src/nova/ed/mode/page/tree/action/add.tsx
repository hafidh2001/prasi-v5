import { createId } from "@paralleldrive/cuid2";
import { activateItem, active, getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";

export const edActionAdd = async (p: PG, item?: IItem) => {
  const new_item: IItem = item || {
    id: createId(),
    name: `${animalNames[Math.floor(Math.random() * animalNames.length)]}`,
    type: "item",
    childs: [],
  };
  getActiveTree(p).update("Add item", ({ findNode, tree }) => {
    const node = findNode(active.item_id);
    if (node) {
      if (node?.item.id === active.item_id) {
        if (
          node.item.type === "text" ||
          (node.item.type === "item" &&
            node.item.component?.id &&
            active.comp?.id !== node.item.component.id)
        ) {
          if (node.parent) {
            const parent = findNode(node.parent.id);
            if (parent) {
              let idx = 0;
              for (const child of parent.item.childs) {
                if (child.id === node.item.id) {
                  parent.item.childs.splice(idx + 1, 0, new_item);
                  break;
                }
                idx++;
              }
            }
          }
        } else {
          node.item.childs.push(new_item);
        }
      }
    } else {
      tree.childs.push({ ...new_item, type: "item", name: "Section" });
    }
  });

  activateItem(p, new_item.id);
};
export const animalNames = [
  "Ant",
  "Ape",
  "Bat",
  "Bear",
  "Bee",
  "Bird",
  "Boar",
  "Bug",
  "Bull",
  "Cat",
  "Cow",
  "Crab",
  "Deer",
  "Dove",
  "Duck",
  "Eagle",
  "Eel",
  "Elk",
  "Emu",
  "Fish",
  "Fox",
  "Frog",
  "Goat",
  "Hawk",
  "Hen",
  "Hare",
  "Hippo",
  "Horse",
  "Koi",
  "Lion",
  "Lynx",
  "Mole",
  "Moth",
  "Mouse",
  "Newt",
  "Owl",
  "Panda",
  "Rat",
  "Seal",
  "Shark",
  "Sheep",
  "Sloth",
  "Snake",
  "Swan",
  "Tiger",
  "Toad",
  "Wolf",
  "Worm",
];
