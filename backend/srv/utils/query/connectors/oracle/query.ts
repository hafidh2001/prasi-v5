import type { PQuerySelect } from "prasi-frontend/src/nova/ed/mode/query/types";
import type { QInspectResult } from "utils/query/types";
import { getColumns } from "./utils/get-columns";
import { getJoins } from "./utils/get-joins";
import { getWheres } from "./utils/get-wheres";
import { getOrdersBy } from "./utils/get-orders-by";

export const query = async (
  inspected_scheme: QInspectResult,
  pq: PQuerySelect
): Promise<{
  columns_arr: string[];
  joins_arr: string[];
  wheres_arr: string[];
  orders_by_arr: string[];
}> => {
  const { select, table, where, order_by } = pq;
  const columns_arr = getColumns(inspected_scheme, table, select);
  const joins_arr = getJoins(inspected_scheme, table, select);
  const wheres_arr = getWheres(table, select, where);
  const orders_by_arr = getOrdersBy(table, select, order_by);

  return {
    columns_arr,
    joins_arr,
    wheres_arr,
    orders_by_arr,
  };
};
