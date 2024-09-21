import { FC, useEffect } from "react";
import { ViProp } from "./lib/types";
import { useVi } from "./lib/store";

export const Vi: FC<ViProp> = ({ page, comps }) => {
  const vi = useVi(({ action, state }) => ({
    load: action.load,
    page: state.page,
  }));

  useEffect(() => {
    vi.load({ page, comps });
  }, [page, comps]);
  console.log();

  return <>mantap jiwa</>;
};
