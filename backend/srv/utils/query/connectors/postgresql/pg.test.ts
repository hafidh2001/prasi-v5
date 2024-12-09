import { test, expect, describe } from "bun:test";
import { connectPg, type QPgConnector } from "./connector";

describe("oracle connector", () => {
  let conn = null as null | QPgConnector;
  test("buat instance pg connector", async () => {
    conn = await connectPg({
      type: "postgresql",
      url: "postgresql://postgres:OaycqRAjPEDM3hiie9eutqI4nB3oMViqzgwqadNHY2pDqmiPO3TUsuii7WL48H34@prasi.avolut.com:5446/prasi?schema=public",
    });
  });

  test("coba inspect + pastikan hasil inspect cocok", async () => {
    const hasil_inspect = await conn?.inspect();
    if (hasil_inspect) {
      console.log(hasil_inspect);
    }
  });
});
