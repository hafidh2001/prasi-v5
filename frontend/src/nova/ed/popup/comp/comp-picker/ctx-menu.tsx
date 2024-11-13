import { FC } from "react";
import { Menu, MenuItem } from "utils/ui/context-menu";

export const EdCompPickerCtxMenu: FC<{
  event?: React.MouseEvent<HTMLElement, MouseEvent>;
  comp_id?: string;
  onClose: () => void;
  onEdit: () => void;
}> = ({ event, onClose, onEdit }) => {
  if (!event) return null;

  return (
    <Menu mouseEvent={event} onClose={onClose}>
      <MenuItem
        label={"Edit"}
        onClick={() => {
          onEdit();
        }}
      />
    </Menu>
  );
};
