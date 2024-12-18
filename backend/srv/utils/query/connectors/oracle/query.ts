import type { PQuerySelect } from "prasi-frontend/src/nova/ed/mode/query/types";
import type { QInspectResult } from "utils/query/types";
import { getColumns } from "./utils/get-columns";
import { getJoins } from "./utils/get-joins";
import { getWheres } from "./utils/get-wheres";

export const query = async (
  inspected_scheme: QInspectResult,
  pq: PQuerySelect
): Promise<{
  columns_arr: string[];
  joins_arr: string[];
  wheres_arr: string[];
}> => {
  const { select, table, where } = pq;
  const columns_arr = getColumns(inspected_scheme, table, select);
  const joins_arr = getJoins(inspected_scheme, table, select);
  const wheres_arr = getWheres(inspected_scheme, table, select, where);

  return {
    columns_arr,
    joins_arr,
    wheres_arr,
  };
};
