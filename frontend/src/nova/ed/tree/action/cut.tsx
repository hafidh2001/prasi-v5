import { PG } from "logic/ed-global";
import { IItem } from "utils/types/item";
import { edActionDelete } from "./delete";

export const edActionCut = async (p: PG, item: IItem) => {
  const perm = await navigator.permissions.query({
    name: "clipboard-read",
    allowWithoutGesture: false,
  } as any);

  if (perm.state !== "granted") {
    await navigator.clipboard.read();
  }
  let str = `prasi-clipboard:` + JSON.stringify(item);
  navigator.clipboard.writeText(str);

  edActionDelete(p, item);
};
