export type DBInspectTable = {
  columns: Record<
    string,
    {
      is_pk: boolean;
      type: string;
      optional: boolean;
      db_type: string;
      default?: any;
    }
  >;
  relations: Record<string, DBHasManyType | DBHasOneType>;
};
export type DBHasManyType = {
  type: "has-many";
  to: { table: string; fields: string[] };
  from: { table: string; fields: string[] };
};
export type DBHasOneType = {
  type: "has-one";
  to: { table: string; fields: string[] };
  from: { table: string; fields: string[] };
};
export type DBInspectResult = Record<string, DBInspectTable>;
