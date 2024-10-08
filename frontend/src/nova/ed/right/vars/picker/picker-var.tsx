import { FC, ReactElement } from "react";
import { Popover } from "utils/ui/popover";

export const EdPickerVar: FC<{ item_id: string; children: ReactElement }> = ({
  item_id,
  children,
}) => {
  return (
    <Popover border="1px solid black" content={<></>}>
      {children}
    </Popover>
  );
};
