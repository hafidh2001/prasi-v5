import { FC } from "react";

export const ExprPartsStatic: FC<{ children: any }> = ({ children }) => {
  return <div className={cx("expr expr-static")}>{children}</div>;
};
