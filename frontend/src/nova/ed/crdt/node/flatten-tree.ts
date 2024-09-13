import { NodeModel } from "@minoru/react-dnd-treeview";
import { IItem } from "../../../../utils/types/item";
import { PNode } from "../../logic/types";

export const flattenTree = (
  items: IItem[],
  arg?: {
    parent: IItem;
    array: PNode[];
    models: NodeModel<PNode>[];
    map: Record<string, PNode>;
    parent_comp?: {
      prop_name: string;
      comp_id: string;
      instance_id: string;
    };
  }
) => {
  const models: NodeModel<PNode>[] = arg?.models
    ? arg.models
    : [{ id: "root", text: "", data: { id: "root" } as any, parent: "" }];
  const array: PNode[] = arg?.array ? arg.array : [];
  const map: Record<string, PNode> = arg?.map ? arg.map : {};

  for (const item of items) {
    if (item.component) {
      const props = parseComponentProps(item);
      for (const [name, pitem] of Object.entries(props)) {
        flattenTree([pitem], {
          parent: item,
          parent_comp: {
            prop_name: name,
            instance_id: item.id,
            comp_id: item.component.id,
          },
          models: models,
          array,
          map,
        });
      }
    }

    map[item.id] = {
      item,
      parent: arg
        ? { id: arg.parent.id, component: arg.parent_comp }
        : undefined,
    };
    models.push({
      id: item.id,
      parent: arg?.parent.id || "root",
      text: "",
      data: map[item.id],
    });
    array.push(map[item.id]);
    if (item.childs) {
      flattenTree(item.childs, { parent: item, models: models, array, map });
    }
  }

  return { array, map, models };
};

const parseComponentProps = (item: IItem) => {
  const result = {} as Record<string, IItem>;
  if (item.component)
    for (const [name, prop] of Object.entries(item.component.props)) {
      if (prop.meta?.type === "content-element" && prop.content) {
        result[name] = prop.content;
      }
    }
  return result;
};

export const findNodeById = (
  id: string,
  items: IItem[],
  arg?: {
    parent: IItem;
    parent_comp?: {
      prop_name: string;
      comp_id: string;
      instance_id: string;
    };
  }
): null | PNode => {
  for (const item of items) {
    if (item.id === id)
      return {
        item,
        parent: arg?.parent
          ? { id: arg.parent.id || "", component: arg.parent_comp }
          : undefined,
      };

    if (item.component) {
      const props = parseComponentProps(item);
      for (const [name, pitem] of Object.entries(props)) {
        const found = findNodeById(id, [pitem], {
          parent: item,
          parent_comp: {
            prop_name: name,
            instance_id: item.id,
            comp_id: item.component.id,
          },
        });
        if (found) return found;
      }
    }
    if (item.childs) {
      const found = findNodeById(id, item.childs, { parent: item });
      if (found) {
        return found;
      }
    }
  }

  return null;
};
