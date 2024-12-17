import OracleDB from "oracledb";

import { inspect } from "./inspect";
import { query } from "./query";
import { oracleConfig } from "./utils/config";

import type { QConnector, QConnectorParams } from "utils/query/types";
export type QOracleConnector = Awaited<ReturnType<typeof connectOracle>>;

export const connectOracle = async (conn: QConnectorParams) => {
  const config = oracleConfig(conn);
  config.conn = await OracleDB.getConnection(config.conn_params);

  const connector: QConnector = {
    async inspect() {
      return await inspect(config);
    },
    async destroy() {
      config.conn?.close();
    },
    async query(i, pq) {
      return await query(i, pq);
    },
  };
  connector.inspected = await connector.inspect();

  return connector;
};
