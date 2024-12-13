import type { PQuerySelect } from "prasi-frontend/src/nova/ed/mode/query/types";
import type { QInspectResult } from "utils/query/types";
import { getColumns } from "./utils/get-columns";

export const query = async (
  inspected_scheme: QInspectResult,
  pq: PQuerySelect
): Promise<any> => {
  const { select, table } = pq;
  const x = getColumns(inspected_scheme, table, select);
  console.log({x});
};
