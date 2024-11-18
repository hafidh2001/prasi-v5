import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { Menu, MenuItem } from "utils/ui/context-menu";
import { compPickerToNodes } from "./to-nodes";

export const EdCompPickerCtxMenu: FC<{
  event?: React.MouseEvent<HTMLElement, MouseEvent>;
  comp_id?: string;
  onClose: () => void;
  onEdit: () => void;
}> = ({ event, onClose, onEdit, comp_id }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  if (!event) {
    return null;
  }

  const popup = p.ui.popup.comp;

  if (popup.tab === "Trash") {
    return (
      <Menu mouseEvent={event} onClose={onClose}>
        <MenuItem
          label={"Restore"}
          onClick={(e) => {
            p.ui.popup.comp_group = {
              mouse_event: e,
              async on_pick(group_id) {
                popup.status = "processing";
                p.render();
                const data = p.ui.popup.comp.data;
                const comp = await _db.component.findFirst({
                  where: { id: comp_id },
                });
                if (comp) {
                  const found = data.comps.find((item) => comp_id === item.id);
                  if (found) {
                    found.id_component_group = group_id;
                  }
                  compPickerToNodes(p);
                  p.render();

                  await _db.component.update({
                    where: { id: comp_id },
                    data: { id_component_group: group_id },
                  });
                }

                popup.status = "ready";
                p.render();
              },
              on_close(group_id) {
                if (!group_id) {
                  popup.status = "ready";
                  p.render();
                }
              },
            };
            p.render();
          }}
        />
        <MenuItem
          label={"Delete Permanently"}
          onClick={async () => {
            if (
              confirm(
                "Are you sure you want to delete this component permanently?"
              )
            ) {
              const data = p.ui.popup.comp.data;
              data.comps = data.comps.filter((item) => comp_id !== item.id);
              compPickerToNodes(p);
              p.render();

              await _db.component.update({
                where: { id: comp_id },
                data: { deleted_at: new Date() },
              });
            }
          }}
        />
      </Menu>
    );
  }

  return (
    <Menu mouseEvent={event} onClose={onClose}>
      <MenuItem
        label={"Edit"}
        onClick={() => {
          onEdit();
        }}
      />

      <MenuItem
        label={"Clone"}
        onClick={(e) => {
          popup.status = "processing";
          p.render();
          p.ui.popup.comp_group = {
            mouse_event: e,
            async on_pick(group_id) {
              const comp = await _db.component.findFirst({
                where: { id: comp_id },
              });
              if (comp) {
                const name = prompt(
                  "Enter a name for the cloned component:",
                  comp.name + " Clone"
                );
                if (name) {
                  delete (comp as any).id;
                  (comp as any).id_component_group = group_id;
                  (comp as any).name = name;
                  const res = await _db.component.create({
                    data: comp as any,
                    select: {
                      id: true,
                      name: true,
                      id_component_group: true,
                      component_ext: { select: { id: true } },
                    },
                  });

                  popup.data.comps.push(res);
                  compPickerToNodes(p);
                }
              }

              popup.status = "ready";
              p.render();
            },
            on_close(group_id) {
              if (!group_id) {
                popup.status = "ready";
                p.render();
              }
            },
          };
          p.render();
        }}
      />
      <MenuItem
        label={"Delete"}
        onClick={async () => {
          const data = p.ui.popup.comp.data;
          const trash_folder = data.groups.find((e) => e.name === "__TRASH__");

          if (trash_folder) {
            const found = data.comps.find((item) => comp_id === item.id);
            if (found) {
              found.id_component_group = trash_folder.id;
            }
            compPickerToNodes(p);
            p.render();

            await _db.component.update({
              where: { id: comp_id },
              data: { id_component_group: trash_folder.id },
            });
          }
        }}
      />
    </Menu>
  );
};
