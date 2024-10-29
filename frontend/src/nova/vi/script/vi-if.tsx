import { FC, ReactNode } from "react";

export const IF: FC<{
  condition?: boolean;
  then: ReactNode;
  else?: ReactNode;
}> = (opt) => {
  if (opt.condition) {
    return opt.then;
  }
  return opt.else || null;
};
