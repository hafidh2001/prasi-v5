import { IItem, IVar } from "utils/types/item";

type ITEM_ID = string;
type VAR_ID = string;

export type TreeVarItems = Record<
  VAR_ID,
  { item: Readonly<IItem>; var: Readonly<IVar<any>>; item_id: string }
>;
