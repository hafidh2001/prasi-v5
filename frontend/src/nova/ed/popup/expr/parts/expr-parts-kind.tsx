import { FC } from "react";
import { ExprPartList } from "./expr-parts-list";

export const ExprPartKind: FC<{ name: string }> = ({ name }) => {
  return (
    <div className={cx("expr expr-kind", name)}>
      {name}

      <ExprPartList />
    </div>
  );
};
