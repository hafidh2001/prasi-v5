import * as pg from "pg";
import type { QConnector, QConnectorParams } from "utils/query/types";
import { pgConfig } from "./utils/config";
import { inspect } from "./inspect";

export type QPgConnector = Awaited<ReturnType<typeof connectPg>>;

export const connectPg = async (conn: QConnectorParams) => {
  const Pool = pg.native?.Pool || pg.Pool;
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
