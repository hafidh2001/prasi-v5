export type NAME = string;
export type DB_NAME = string;

export type QConnectorParams = {
  type: "postgresql" | "oracle";
  url: string;
};

export interface QConnector {
  inspect(): Promise<QInspectResult>;
  destroy(): Promise<void>;
}

export type QInspectColumn = {
  name: NAME;
  type: "string" | "date" | "number" | "boolean";
  db_type: string;
  db_name: DB_NAME;
  is_pk: boolean;
  nullable: boolean;
};

export type QInspectFK = {
  from: NAME;
  to: { table: NAME; column: NAME };
};

export type QInspectRelation = {
  type: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
  from: { table: NAME; column: NAME };
  to: { table: NAME; column: NAME };
};

export type QInspectTable = {
  name: NAME;
  pk: NAME[];
  db_name: DB_NAME;
  fk: Record<NAME, QInspectFK>;
  columns: Record<NAME, QInspectColumn>;
  relations: Record<NAME, QInspectRelation>;
};

export type QInspectResult = {
  tables: Record<NAME, QInspectTable>;
};
