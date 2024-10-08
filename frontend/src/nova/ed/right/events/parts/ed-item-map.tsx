import { FC } from "react";
import { Popover } from "utils/ui/popover";

export const EdItemMap: FC<{ children: any }> = ({ children }) => {
  return (
    <Popover border="1px solid black" content={<></>}>
      {children}
    </Popover>
  );
};
