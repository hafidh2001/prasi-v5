import OracleDB from "oracledb";
import type { QConnector, QConnectorParams } from "utils/query/types";
import { oracleConfig } from "./internal";
import { inspect } from "./inspect";

export type QOracleConnector = Awaited<ReturnType<typeof connectOracle>>;

export const connectOracle = async (conn: QConnectorParams) => {
  const config = oracleConfig(conn);
  config.conn = await OracleDB.getConnection(config.conn_params);

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

const a = await connectOracle({
  type: "oracle",
  url: "oracle://SYSTEM:Password123@prasi.avolut.com:1521/XEPDB1",
});
console.log("CONNECTION SUCCESS");

await a.inspect();
console.log("END");