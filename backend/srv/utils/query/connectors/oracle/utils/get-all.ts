import type { OracleConfig } from "./config";

export const oracleGetAll = async <T>(c: OracleConfig, sql: string) => {
  const data = await c.conn?.execute<string>(sql);
  const result = [] as T[];

  for (const row of data?.rows || []) {
    const item = {} as any;

    for (let i = 0; i < Object.keys(row).length; i++) {
      const meta = (data?.metaData || [])[i];

      if (meta) {
        item[meta.name] = row[i];
      }
    }
    result.push(item);
  }

  return result;
};
