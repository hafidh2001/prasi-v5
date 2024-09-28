import { FC } from "react";
import { EValue, EVar } from "./lib/type";

export const PVar: FC<{
  evar: EVar;
  children: ({
    base,
    varName,
  }: {
    base: EValue;
    varName: string;
  }) => JSX.Element;
}> = ({ evar, children }) => {
  const base: EValue = { type: evar.typings, value: null as any };

  return <>{children({ base: base, varName: evar.name })}</>;
};
