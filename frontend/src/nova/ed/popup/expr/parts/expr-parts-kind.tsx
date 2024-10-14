import { FC, useEffect } from "react";
import { ExprPartList } from "./expr-parts-list";
import { useLocal } from "utils/react/use-local";

export const ExprPartKind: FC<{ name: string }> = ({ name }) => {
  const local = useLocal({
    action: {} as
      | {
          selectNext: () => void;
          selectPrev: () => void;
          pick: () => void;
        }
      | undefined,
  });

  useEffect(() => {
    const fn = (e: any) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();

        local.action?.selectNext();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();

        local.action?.selectPrev();
      }

      if (e.key === "Enter") {
        e.preventDefault();

        local.action?.pick();
      }
    };
    window.addEventListener("keydown", fn);
    return () => {
      window.removeEventListener("keydown", fn);
    };
  }, []);

  return (
    <div className={cx("expr expr-kind", name)}>
      {name}

      <div onClick={() => local.action?.selectNext()}>NEXT</div>
      <div onClick={() => local.action?.selectPrev()}>PREV</div>

      <ExprPartList bind={(act) => (local.action = act)} />
    </div>
  );
};
