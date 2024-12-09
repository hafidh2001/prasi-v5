import type { Pool, PoolConfig } from "pg";
import type { QConnectorParams } from "utils/query/types";
import trim from "lodash.trim";

export const pgConfig = (config: QConnectorParams) => {
  const url = new URL(config.url);

  const pool_params: PoolConfig = {
    host: url.hostname,
    port: parseInt(url.port),
    database: trim(url.pathname, "/"),
    user: url.username,
    password: url.password,
  };

  return {
    pool_params,
    schema: url.searchParams.get("schema") || "public",
    pool: null as null | Pool,
  };
};

export type PgConfig = ReturnType<typeof pgConfig>;
