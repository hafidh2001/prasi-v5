import type { QConnector, QConnectorParams } from "utils/query/types";

export type QOracleConnector = Awaited<ReturnType<typeof connectOracle>>;
export const connectOracle = async (conn: QConnectorParams) => {
  // connect dulu disini
  const oracle = {
    query(sql: string) {
      return [{}];
    },
  }; // connect to oracle database

  const result: QConnector = {
    async inspect() {
      const result = oracle.query(`SQL UNTUK MENG-INSPECT`);

      // format hasil result nya, sesuai dengan QInspectTable
      return { tables: {} };
    },
  };
  return result;
};
