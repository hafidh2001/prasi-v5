import type {
  NAME,
  QInspectColumn,
  QInspectFK,
  QInspectRelation,
  QInspectResult,
  QInspectTable,
} from "utils/query/types";
import type { OracleConfig } from "./utils/config";
import { oracleGetAll } from "./utils/get-all";
import { relationSuffix } from "./utils/relation-suffix";

export const inspect = async (c: OracleConfig): Promise<QInspectResult> => {
  const result = {
    tables: {},
  } as QInspectResult;

  let schema = c.schema;

  if (!schema) {
    const query_schema = await oracleGetAll(
      c,
      `select sys_context('USERENV', 'CURRENT_SCHEMA') from dual;
    `
    );
  }

  const tables = await oracleGetAll<{ NAME: string }>(
    c,
    `SELECT table_name AS NAME 
    FROM all_tables 
    WHERE owner = '${schema}'`
  );

  const raw_columns = await oracleGetAll<{
    TABLE_NAME: string;
    COLUMN_NAME: string;
    NULLABLE: string;
    DATA_TYPE: string;
    DATA_LENGTH: number;
  }>(
    c,
    `SELECT table_name, column_name, nullable, data_type, data_length
    FROM all_tab_columns
    WHERE owner = '${schema}'`
  );

  const pk_columns = await oracleGetAll<{
    TABLE_NAME: string;
    COLUMN_NAME: string;
  }>(
    c,
    `SELECT cols.table_name, cols.column_name
    FROM all_constraints cons
    JOIN all_cons_columns cols
    ON cons.constraint_name = cols.constraint_name
    WHERE cons.constraint_type = 'P' AND cons.owner = '${schema}'`
  );

  const fk_columns = await oracleGetAll<{
    FROM_TABLE: string;
    FROM_COLUMN: string;
    TO_TABLE: string;
    TO_COLUMN: string;
  }>(
    c,
    `SELECT a.table_name AS from_table, a.column_name AS from_column, c_pk.table_name AS to_table, b.column_name AS to_column
    FROM all_cons_columns a
    JOIN all_constraints c ON a.constraint_name = c.constraint_name
    JOIN all_constraints c_pk ON c.r_constraint_name = c_pk.constraint_name
    JOIN all_cons_columns b ON c_pk.constraint_name = b.constraint_name
    WHERE c.constraint_type = 'R' AND a.owner = '${schema}'`
  );

  // Create a Map for quick lookup of PKs
  const pkMap = new Map<string, Set<string>>();
  for (const pk of pk_columns) {
    if (!pkMap.has(pk.TABLE_NAME)) {
      pkMap.set(pk.TABLE_NAME, new Set());
    }
    pkMap.get(pk.TABLE_NAME)!.add(pk.COLUMN_NAME);
  }

  // Create a Map for quick lookup of FKs
  const fkMap = new Map<string, QInspectFK[]>();
  for (const fk of fk_columns) {
    if (!fkMap.has(fk.FROM_TABLE)) {
      fkMap.set(fk.FROM_TABLE, []);
    }
    fkMap.get(fk.FROM_TABLE)!.push({
      from: fk.FROM_COLUMN.toLowerCase(),
      to: {
        table: fk.TO_TABLE.toLowerCase(),
        column: fk.TO_COLUMN.toLowerCase(),
      },
    });
  }

  // Populate tables with columns, PKs, FKs, and Relations
  for (const table of tables) {
    const table_name = table.NAME.toLowerCase();

    const columns = {} as Record<NAME, QInspectColumn>;
    const pk = [] as QInspectTable["pk"];
    const fk = {} as Record<NAME, QInspectFK>;
    const relations = {} as Record<NAME, QInspectRelation>;

    for (const raw_col of raw_columns) {
      if (raw_col.TABLE_NAME === table.NAME) {
        const col_name = raw_col.COLUMN_NAME.toLowerCase();

        // Determine the column type
        let col_type = "string" as QInspectColumn["type"];
        if (raw_col.DATA_TYPE === "NUMBER") col_type = "number";

        // Check if this column is a PK
        const isPk = pkMap.get(table.NAME)?.has(raw_col.COLUMN_NAME) || false;
        if (isPk) {
          pk.push(col_name);
        }

        // Populate column details
        columns[col_name] = {
          name: col_name,
          db_name: raw_col.COLUMN_NAME,
          db_type: raw_col.DATA_TYPE,
          nullable: raw_col.NULLABLE !== "N",
          type: col_type,
          is_pk: isPk,
        };
      }
    }

    // Populate FK for the table
    const tableFks = fkMap.get(table.NAME) || [];

    for (const fks of tableFks) {
      fk[fks.from] = fks;
    }

    // Populate Relations for the table
    for (const fk of tableFks) {
      const fromTable = table_name;
      const fromColumn = fk.from.toLowerCase();
      const toTable = fk.to.table.toLowerCase();
      const toColumn = fk.to.column.toLowerCase();

      // Determine relation type
      const relationType: QInspectRelation["type"] =
        fromTable === toTable ? "one-to-many" : "many-to-one";

      // Add relation to the current table
      const relationKey = relationSuffix(toTable, relations);
      if (!relations[relationKey]) {
        relations[relationKey] = {
          type: relationType,
          from: { table: fromTable, column: fromColumn },
          to: { table: toTable, column: toColumn },
        };
      }

      if (!result.tables[toTable]) {
        result.tables[toTable] = {
          name: toTable,
          pk: [],
          db_name: toTable.toUpperCase(),
          fk: {},
          columns: {},
          relations: {},
        };
      }
    }

    // Handle additional relations where other tables reference the current table
    for (const [refTable, fks] of fkMap) {
      for (const fk of fks) {
        if (fk.to.table.toLowerCase() === table_name) {
          const refRelationKey = relationSuffix(
            refTable.toLowerCase(),
            relations
          );
          if (!relations[refRelationKey]) {
            relations[refRelationKey] = {
              type: "one-to-many",
              from: {
                table: refTable.toLowerCase(),
                column: fk.from.toLowerCase(),
              },
              to: { table: table_name, column: fk.to.column.toLowerCase() },
            };
          }
        }
      }
    }

    // Populate table details
    result.tables[table_name] = {
      name: table.NAME.toLowerCase(),
      pk,
      db_name: table.NAME,
      fk,
      columns,
      relations,
    };
  }

  // console.log(JSON.stringify(result, null, 2));
  return result;
};
