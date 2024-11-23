import type {
  PrismaClient as PrasiDBClient,
  Prisma as PrasiDB,
} from "prasi-prisma";
export type PrasiDBEditor = PrasiDBClient & {
  _batch: {
    update: <T extends PrasiDB.ModelName>(
      batch: {
        table: T;
        data: Exclude<
          Parameters<PrasiDBClient[T]["update"]>[0],
          undefined
        >["data"];
        where: Exclude<
          Parameters<PrasiDBClient[T]["findMany"]>[0],
          undefined
        >["where"];
      }[]
    ) => Promise<void>;
    upsert: <T extends PrasiDB.ModelName>(arg: {
      table: T;
      where: Exclude<
        Parameters<PrasiDBClient[T]["findMany"]>[0],
        undefined
      >["where"];
      data: Exclude<
        Parameters<PrasiDBClient[T]["create"]>[0],
        undefined
      >["data"][];
      mode?: "field" | "relation";
    }) => Promise<void>;
  };
  _schema: {
    tables: () => Promise<PrasiDB.ModelName[]>;
    columns: (table: PrasiDB.ModelName) => Promise<
      Record<
        string,
        {
          is_pk: boolean;
          type: string;
          optional: boolean;
          db_type: string;
          default?: any;
        }
      >
    >;
    rels: (table: PrasiDB.ModelName) => Promise<
      Record<
        string,
        {
          type: "has-many" | "has-one";
          to: {
            table: PrasiDB.ModelName;
            fields: string[];
          };
          from: {
            table: PrasiDB.ModelName;
            fields: string[];
          };
        }
      >
    >;
  };
};
