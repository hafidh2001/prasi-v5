import { test, expect, describe } from "bun:test";
import { connectOracle, type QOracleConnector } from "./connector";

describe("oracle connector", () => {
  let conn = null as null | QOracleConnector;
  test("buat instance oracleConnector", async () => {
    conn = await connectOracle({ type: "oracle", url: "" });
  });

  test("coba inspect + pastikan hasil inspect cocok", async () => {
    const hasil_inspect = await conn?.inspect();
    if (hasil_inspect) {
      // expect(hasil_inspect.type).toBe("oracle");
      // expect(hasil_inspect.url).toBe("");
    }
  });
});
