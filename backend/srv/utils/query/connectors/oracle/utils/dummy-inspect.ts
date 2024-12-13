import type { QInspectResult } from "utils/query/types";

const inspectResult: QInspectResult = {
  tables: {
    user_table: {
      name: "user_table",
      pk: ["user_id"],
      db_name: "USER_TABLE",
      fk: {
        role_id1: {
          from: "role_id1",
          to: {
            table: "role_table",
            column: "role_id",
          },
        },
        role_id2: {
          from: "role_id2",
          to: {
            table: "role_table",
            column: "role_id",
          },
        },
      },
      columns: {
        user_id: {
          name: "user_id",
          db_name: "USER_ID",
          db_type: "NUMBER",
          nullable: false,
          type: "number",
          is_pk: true,
        },
        username: {
          name: "username",
          db_name: "USERNAME",
          db_type: "VARCHAR2",
          nullable: false,
          type: "string",
          is_pk: false,
        },
        email: {
          name: "email",
          db_name: "EMAIL",
          db_type: "VARCHAR2",
          nullable: false,
          type: "string",
          is_pk: false,
        },
        created_at: {
          name: "created_at",
          db_name: "CREATED_AT",
          db_type: "TIMESTAMP(6)",
          nullable: true,
          type: "string",
          is_pk: false,
        },
        role_id1: {
          name: "role_id1",
          db_name: "ROLE_ID1",
          db_type: "NUMBER",
          nullable: true,
          type: "number",
          is_pk: false,
        },
        role_id2: {
          name: "role_id2",
          db_name: "ROLE_ID2",
          db_type: "NUMBER",
          nullable: true,
          type: "number",
          is_pk: false,
        },
      },
      relations: {
        role_table: {
          type: "many-to-one",
          from: {
            table: "user_table",
            column: "role_id1",
          },
          to: {
            table: "role_table",
            column: "role_id",
          },
        },
        role_table2: {
          type: "many-to-one",
          from: {
            table: "user_table",
            column: "role_id2",
          },
          to: {
            table: "role_table",
            column: "role_id",
          },
        },
        photo: {
          type: "one-to-many",
          from: {
            table: "photo",
            column: "user_id",
          },
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
        comment_table: {
          type: "one-to-many",
          from: {
            table: "comment_table",
            column: "user_id",
          },
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
        role_table3: {
          type: "one-to-many",
          from: {
            table: "role_table",
            column: "user_id",
          },
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
      },
    },
    photo: {
      name: "photo",
      pk: ["photo_id"],
      db_name: "PHOTO",
      fk: {
        user_id: {
          from: "user_id",
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
      },
      columns: {
        photo_id: {
          name: "photo_id",
          db_name: "PHOTO_ID",
          db_type: "NUMBER",
          nullable: false,
          type: "number",
          is_pk: true,
        },
        user_id: {
          name: "user_id",
          db_name: "USER_ID",
          db_type: "NUMBER",
          nullable: false,
          type: "number",
          is_pk: false,
        },
        photo_url: {
          name: "photo_url",
          db_name: "PHOTO_URL",
          db_type: "VARCHAR2",
          nullable: false,
          type: "string",
          is_pk: false,
        },
        description: {
          name: "description",
          db_name: "DESCRIPTION",
          db_type: "VARCHAR2",
          nullable: true,
          type: "string",
          is_pk: false,
        },
        created_at: {
          name: "created_at",
          db_name: "CREATED_AT",
          db_type: "TIMESTAMP(6)",
          nullable: true,
          type: "string",
          is_pk: false,
        },
      },
      relations: {
        user_table: {
          type: "many-to-one",
          from: {
            table: "photo",
            column: "user_id",
          },
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
        comment_table: {
          type: "one-to-many",
          from: {
            table: "comment_table",
            column: "photo_id",
          },
          to: {
            table: "photo",
            column: "photo_id",
          },
        },
      },
    },
    comment_table: {
      name: "comment_table",
      pk: ["comment_id"],
      db_name: "COMMENT_TABLE",
      fk: {
        user_id: {
          from: "user_id",
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
        photo_id: {
          from: "photo_id",
          to: {
            table: "photo",
            column: "photo_id",
          },
        },
      },
      columns: {
        comment_id: {
          name: "comment_id",
          db_name: "COMMENT_ID",
          db_type: "NUMBER",
          nullable: false,
          type: "number",
          is_pk: true,
        },
        photo_id: {
          name: "photo_id",
          db_name: "PHOTO_ID",
          db_type: "NUMBER",
          nullable: false,
          type: "number",
          is_pk: false,
        },
        user_id: {
          name: "user_id",
          db_name: "USER_ID",
          db_type: "NUMBER",
          nullable: false,
          type: "number",
          is_pk: false,
        },
        comment_text: {
          name: "comment_text",
          db_name: "COMMENT_TEXT",
          db_type: "VARCHAR2",
          nullable: false,
          type: "string",
          is_pk: false,
        },
        created_at: {
          name: "created_at",
          db_name: "CREATED_AT",
          db_type: "TIMESTAMP(6)",
          nullable: true,
          type: "string",
          is_pk: false,
        },
      },
      relations: {
        user_table: {
          type: "many-to-one",
          from: {
            table: "comment_table",
            column: "user_id",
          },
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
        photo: {
          type: "many-to-one",
          from: {
            table: "comment_table",
            column: "photo_id",
          },
          to: {
            table: "photo",
            column: "photo_id",
          },
        },
      },
    },
    role_table: {
      name: "role_table",
      pk: ["role_id"],
      db_name: "ROLE_TABLE",
      fk: {
        user_id: {
          from: "user_id",
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
      },
      columns: {
        role_id: {
          name: "role_id",
          db_name: "ROLE_ID",
          db_type: "NUMBER",
          nullable: false,
          type: "number",
          is_pk: true,
        },
        user_id: {
          name: "user_id",
          db_name: "USER_ID",
          db_type: "NUMBER",
          nullable: false,
          type: "number",
          is_pk: false,
        },
        description: {
          name: "description",
          db_name: "DESCRIPTION",
          db_type: "VARCHAR2",
          nullable: false,
          type: "string",
          is_pk: false,
        },
        created_at: {
          name: "created_at",
          db_name: "CREATED_AT",
          db_type: "TIMESTAMP(6)",
          nullable: true,
          type: "string",
          is_pk: false,
        },
      },
      relations: {
        user_table: {
          type: "many-to-one",
          from: {
            table: "role_table",
            column: "user_id",
          },
          to: {
            table: "user_table",
            column: "user_id",
          },
        },
        user_table2: {
          type: "one-to-many",
          from: {
            table: "user_table",
            column: "role_id1",
          },
          to: {
            table: "role_table",
            column: "role_id",
          },
        },
        user_table3: {
          type: "one-to-many",
          from: {
            table: "user_table",
            column: "role_id2",
          },
          to: {
            table: "role_table",
            column: "role_id",
          },
        },
      },
    },
  },
};
