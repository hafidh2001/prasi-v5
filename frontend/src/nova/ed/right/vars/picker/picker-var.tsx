import { FC } from "react";
import { Popover } from "utils/ui/popover";

export const EdVarPicker: FC<{ children: any }> = ({ children }) => {
  return (
    <Popover
      border="1px solid black"
      placement="left-start"
      content={
        <div
          className={cx(css`
            width: 200px;
            height: 200px;
          `)}
        ></div>
      }
    >
      {children}
    </Popover>
  );
};
