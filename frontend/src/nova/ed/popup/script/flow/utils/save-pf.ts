import { PFlow } from "../runtime/types";
import { fg } from "./flow-global";

export const savePF = (
  name: string,
  pf: PFlow | null,
  opt?: { then?: () => void }
) => {
  fg.update.action = name;
  fg.update.execute(opt?.then);
};
