import type { Connection } from "oracledb";
import type { QConnectorParams } from "utils/query/types";

export const oracleConfig = (config: QConnectorParams) => {
  const url = new URL(config.url);

  const conn_params = {
    user: url.username,
    password: url.password,
    connectString: `${url.hostname}:${url.port}${url.pathname}`,
  };

  return {
    conn: null as null | Connection,
    conn_params,
    schema: url.searchParams.get("schema") || "",
  };
};

export type OracleConfig = ReturnType<typeof oracleConfig>;
