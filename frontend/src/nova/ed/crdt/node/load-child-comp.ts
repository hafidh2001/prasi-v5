import { IItem } from "../../../../utils/types/item";
import { PG } from "../../logic/ed-global";
import { parsePropForJsx } from "./flatten-tree";

export const loopChildComponent = async (
  item: IItem,
  fn: (item: IItem) => Promise<void>
) => {
  if (item.component?.id) {
    fn(item);

    const props = parsePropForJsx(item);
    for (const prop of Object.values(props)) {
      await loopChildComponent(prop, fn);
    }
  }
  if (item.childs)
    for (const child of item.childs) {
      await loopChildComponent(child, fn);
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
      p.comp.loaded[comp.id] = comp;
      await loopChildComponent(comp.content_tree, (item) =>
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
      p.comp.loaded[comp.id] = comp;
      await loopChildComponent(comp.content_tree, (item) =>
        loadChildComponent(p, item)
      );
      p.comp.pending.delete(comp.id);
    }
  }
};
