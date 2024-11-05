import get from "lodash.get";
import { PG } from "logic/ed-global";
import { FNCompDef } from "utils/types/meta-fn";

export const propGroupInfo = (
  p: PG,
  value: [string, FNCompDef],
  comp_id: string
) => {
  const is_group = value[0].includes("__");
  let group_expanded = false;
  let group_name = "";
  let is_group_child = false;
  if (is_group) {
    group_name = value[0].split("__").shift() + "__" || "";
    group_expanded = get(
      p.ui.comp.prop.expanded,
      `${comp_id}.${group_name}`,
      false
    ) as boolean;

    if (!value[0].endsWith("__")) {
      is_group_child = true;
    }
  }
  return { is_group, is_group_child, group_expanded, group_name };
};
