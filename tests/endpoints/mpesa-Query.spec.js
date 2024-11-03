import { expect } from "chai";
import { mpesaQueryApi } from "./utils/init.js";
import { createOptionsForMpesaQuery } from "./utils/options.js";

describe("Lipa Na M-Pesa C2B query API", function () {
  this.timeout(15000);
});
it("Should initiate Lipa Na M-pesa payment query, and receive a callback", async function () {
  const responseBody = await mpesaQueryApi(createOptionsForMpesaQuery());
  expect(responseBody).to.be.an("object");
  console.log("RESPONSE BODY", JSON.stringify(responseBody, null, 2));
});
