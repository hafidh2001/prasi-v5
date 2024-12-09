import { native, Pool as PGPool } from "pg";
import type { QConnector, QConnectorParams } from "utils/query/types";
import { pgConfig } from "./utils/config";
import { inspect } from "./inspect";

export type QPgConnector = ReturnType<typeof connectPg>;

export const connectPg = async (conn: QConnectorParams) => {
  const Pool = native?.Pool || PGPool;
  const config = pgConfig(conn);
  config.pool = new Pool(config.pool_params);

  const result: QConnector = {
    async inspect() {
      return await inspect(config);
    },
    async destroy() {
      console.log("destroy");
    },
  };
  return result;
};
