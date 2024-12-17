import type { PQuerySelect } from "prasi-frontend/src/nova/ed/mode/query/types";
import type { QInspectResult } from "utils/query/types";
import { getColumns } from "./utils/get-columns";
import { getJoins } from "./utils/get-joins";

export const query = async (
  inspected_scheme: QInspectResult,
  pq: PQuerySelect
): Promise<{
  columns_arr: string[];
  joins_arr: string[];
}> => {
  const { select, table } = pq;
  const columns_arr = getColumns(inspected_scheme, table, select);
  const joins_arr = getJoins(inspected_scheme, table, select);

  return {
    columns_arr,
    joins_arr,
  };
};
