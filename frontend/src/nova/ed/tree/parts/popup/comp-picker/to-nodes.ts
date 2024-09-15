import { PG } from "logic/ed-global";

export const compPickerToNodes = (p: PG) => {
  const popup = p.ui.popup.comp;
  popup.data.nodes = [];
  for (const group of popup.data.groups) {
    popup.data.nodes.push({
      id: group.id,
      text: group.name,
      parent: "root",
      data: {
        id: group.id,
        name: group.name,
        type: "folder",
      },
    });
  }

  for (const comp of popup.data.comps) {
    if (comp.id_component_group)
      popup.data.nodes.push({
        id: comp.id,
        text: comp.name,
        parent: comp.id_component_group,
        data: {
          id: comp.id,
          name: comp.name,
          type: "comp",
        },
      });
  }
};
