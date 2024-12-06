import type { QInspectResult } from "utils/query/types";

const exampleQInspectResult: QInspectResult = {
  tables: {
    users: {
      name: "users",
      pk: ["id"],
      db_name: "users_table",
      fk: {
        profile_id: {
          from: "profile_id",
          to: { table: "profiles", column: "id" },
        },
      },
      columns: {
        id: {
          name: "id",
          type: "number",
          db_type: "int",
          db_name: "user_id",
          is_pk: true,
          nullable: false,
        },
        name: {
          name: "name",
          type: "string",
          db_type: "varchar",
          db_name: "user_name",
          is_pk: false,
          nullable: false,
        },
        email: {
          name: "email",
          type: "string",
          db_type: "varchar",
          db_name: "user_email",
          is_pk: false,
          nullable: false,
        },
        profile_id: {
          name: "profile_id",
          type: "number",
          db_type: "int",
          db_name: "user_profile_id",
          is_pk: false,
          nullable: true,
        },
      },
      relations: {
        profile_relation: {
          type: "many-to-one",
          from: { table: "users", column: "profile_id" },
          to: { table: "profiles", column: "id" },
        },
      },
    },
    profiles: {
      name: "profiles",
      pk: ["id"],
      db_name: "profiles_table",
      fk: {},
      columns: {
        id: {
          name: "id",
          type: "number",
          db_type: "int",
          db_name: "profile_id",
          is_pk: true,
          nullable: false,
        },
        bio: {
          name: "bio",
          type: "string",
          db_type: "text",
          db_name: "profile_bio",
          is_pk: false,
          nullable: true,
        },
      },
      relations: {
        users_relation: {
          type: "one-to-many",
          from: { table: "profiles", column: "id" },
          to: { table: "users", column: "profile_id" },
        },
      },
    },
  },
};
