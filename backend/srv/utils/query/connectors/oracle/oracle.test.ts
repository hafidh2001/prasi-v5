import { test, expect, describe } from "bun:test";
import { connectOracle, type QOracleConnector } from "./connector";
import type { QInspectResult } from "utils/query/types";

describe("oracle connector", () => {
  let conn = null as null | QOracleConnector;
  let inspect = undefined as undefined | QInspectResult;

  test("buat instance oracleConnector", async () => {
    conn = await connectOracle({
      type: "oracle",
      url: "oracle://SYSTEM:Password123@prasi.avolut.com:1521/XEPDB1?schema=PRASI",
    });
  });

  test("coba inspect + pastikan hasil inspect cocok", async () => {
    inspect = await conn?.inspect();
    if (inspect) {
      console.log(inspect);
    }
  });

  test("coba query + output sesuai (2 relasi setingkat)", async () => {
    if (inspect) {
      const output = await conn?.query(inspect, {
        action: "select",
        table: "user_table",
        select: [
          {
            col_name: "username",
            type: "column",
          },
          {
            rel_name: "role_table",
            type: "relation",
            select: [
              {
                col_name: "description",
                type: "column",
                as: "role_name",
              },
            ],
            where: [
              {
                column: "description",
                operator: "=",
                value: "admin",
              },
            ],
          },
          {
            rel_name: "comment_table",
            type: "relation",
            select: [
              {
                col_name: "comment_text",
                type: "column",
              },
            ],
          },
        ],
        where: [
          {
            column: "status",
            operator: "=",
            value: "active",
          },
        ],
      });
      expect(output).toEqual({
        columns_arr: [
          "USER_TABLE.USERNAME",
          "ROLE_TABLE.DESCRIPTION",
          "COMMENT_TABLE.COMMENT_TEXT",
        ],
        joins_arr: [
          "JOIN ROLE_TABLE ON USER_TABLE.ROLE_ID1 = ROLE_TABLE.ROLE_ID",
          "JOIN COMMENT_TABLE ON USER_TABLE.USER_ID = COMMENT_TABLE.USER_ID",
        ],
      });
    }
  });

  test("coba recursive query + output sesuai (2 relasi + 1 recursive relasi)", async () => {
    if (inspect) {
      const output = await conn?.query(inspect, {
        action: "select",
        table: "user_table",
        select: [
          {
            col_name: "username",
            type: "column",
          },
          {
            rel_name: "role_table",
            type: "relation",
            select: [
              {
                col_name: "description",
                type: "column",
                as: "role_name",
              },
            ],
            where: [
              {
                column: "description",
                operator: "=",
                value: "admin",
              },
            ],
          },
          {
            rel_name: "comment_table",
            type: "relation",
            select: [
              {
                col_name: "comment_text",
                type: "column",
              },
              {
                rel_name: "photo",
                type: "relation",
                select: [
                  {
                    col_name: "photo_url",
                    type: "column",
                  },
                ],
              },
            ],
          },
        ],
        where: [
          {
            column: "status",
            operator: "=",
            value: "active",
          },
        ],
      });
      expect(output).toEqual({
        columns_arr: [
          "USER_TABLE.USERNAME",
          "ROLE_TABLE.DESCRIPTION",
          "COMMENT_TABLE.COMMENT_TEXT",
          "PHOTO.PHOTO_URL",
        ],
        joins_arr: [
          "JOIN ROLE_TABLE ON USER_TABLE.ROLE_ID1 = ROLE_TABLE.ROLE_ID",
          "JOIN COMMENT_TABLE ON USER_TABLE.USER_ID = COMMENT_TABLE.USER_ID",
          "JOIN PHOTO ON COMMENT_TABLE.PHOTO_ID = PHOTO.PHOTO_ID",
        ],
      });
    }
  });
});
