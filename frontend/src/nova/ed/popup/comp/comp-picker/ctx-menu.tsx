import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { Menu, MenuItem } from "utils/ui/context-menu";

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
          p.ui.popup.comp_group = {
            mouse_event: e,
            async on_pick(group_id) {
              const comp = await _db.component.findFirst({
                where: { id: comp_id },
              });
              if (comp) {
                delete (comp as any).id;
                (comp as any).id_component_group = group_id;

                await _db.component.create({
                  data: comp as any,
                  select: { id: true },
                });
              }
            },
            on_close() {},
          };
          p.render();
        }}
      />
    </Menu>
  );
};
