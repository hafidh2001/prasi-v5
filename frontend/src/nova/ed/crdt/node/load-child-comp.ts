import { EBaseComp, EComp } from "logic/types";
import { IItem } from "../../../../utils/types/item";
import { PG } from "../../logic/ed-global";
import { parsePropForJsx } from "./flatten-tree";

export const loopChildComponent = async (
  item: IItem,
  fn: (opt: {
    item: IItem;
    stopLoop: () => void;
    parent?: IItem;
  }) => Promise<void>,
  parent?: IItem
) => {
  if (item.component?.id) {
    let should_stop = false;
    const stopLoop = () => {
      should_stop = true;
    };
    await fn({ item, stopLoop, parent });
    if (should_stop) return;

    const props = parsePropForJsx(item);
    for (const prop of Object.values(props)) {
      await loopChildComponent(prop, fn, item);
    }
  }
  if (item.childs)
    for (const child of item.childs) {
      await loopChildComponent(child, fn, item);
    }
};

const loopChildComponentSync = (
  item: IItem,
  fn: (opt: { item: IItem; stopLoop: () => void; parent?: IItem }) => void,
  parent?: IItem
) => {
  if (item.component?.id) {
    let should_stop = false;
    const stopLoop = () => {
      should_stop = true;
    };
    fn({ item, stopLoop, parent });
    if (should_stop) return;

    const props = parsePropForJsx(item);
    for (const prop of Object.values(props)) {
      loopChildComponentSync(prop, fn, item);
    }
  }
  if (item.childs)
    for (const child of item.childs) {
      loopChildComponentSync(child, fn, item);
    }
};

const loadChildComponent = async (p: PG, item: IItem) => {
  if (
    item.component?.id &&
    !p.comp.loaded[item.component.id] &&
    !p.comp.pending.has(item.component.id) &&
    p.sync
  ) {
    p.comp.pending.add(item.component.id);
    const loaded = await p.sync.comp.load([...p.comp.pending]);
    for (const comp of Object.values(loaded)) {
      p.comp.loaded[comp.id] = decorateEComp(comp);
      await loopChildComponent(comp.content_tree, ({ item }) =>
        loadChildComponent(p, item)
      );
    }
    p.comp.pending.delete(item.id);
  }
};

export const loadPendingComponent = async (p: PG) => {
  if (p.sync && p.comp.pending.size > 0) {
    const loaded = await p.sync.comp.load([...p.comp.pending]);
    for (const comp of Object.values(loaded)) {
      p.comp.loaded[comp.id] = decorateEComp(comp);
      await loopChildComponent(comp.content_tree, ({ item }) =>
        loadChildComponent(p, item)
      );
      p.comp.pending.delete(comp.id);
    }
  }
};

export const decorateEComp = (comp: EBaseComp): EComp => {
  const out: EComp = {
    ...comp,
    tree: {
      find(fn) {
        let result = null;
        loopChildComponentSync(
          comp.content_tree,
          ({ item, parent, stopLoop }) => {
            const found = fn({ item, parent: parent?.id });
            if (found) {
              result = found;
              stopLoop();
            }
          }
        );
        return result;
      },
    },
  };

  return out;
};
