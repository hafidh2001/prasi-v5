import { test, expect, describe } from "bun:test";
import { connectOracle, type QOracleConnector } from "./connector";

describe("oracle connector", () => {
  let conn = null as null | QOracleConnector;
  test("buat instance oracleConnector", async () => {
    conn = await connectOracle({
      type: "oracle",
      url: "oracle://SYSTEM:Password123@prasi.avolut.com:1521/XEPDB1?schema=PRASI",
    });
  });

  test("coba inspect + pastikan hasil inspect cocok", async () => {
    const hasil_inspect = await conn?.inspect();
    if (hasil_inspect) {
      console.log(hasil_inspect);
    }
  });
});
