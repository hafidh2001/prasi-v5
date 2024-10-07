import { FC } from "react";

export const EdVarEdit: FC<{ name: string }> = () => {
  return (
    <div
      className={cx(
        "flex",
        css`
          min-height: 400px;
          min-width: 700px;
        `
      )}
    >
      <div className="flex-1 border-r"></div>
      <div className="flex-1"></div>
    </div>
  );
};
