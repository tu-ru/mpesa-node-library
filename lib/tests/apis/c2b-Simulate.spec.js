import { createOptionsForC2bSimulate } from "./utils/options.js";
import { c2bSimulateApi } from "./utils/init.js";
import { expect } from "chai";

describe("C2B Simulate API with OAuth", function () {
  this.timeout(15000);
  it("Should simulate a C2B transaction", async function () {
    const responseBody = await c2bSimulateApi(createOptionsForC2bSimulate());
    expect(responseBody).to.be.an("object");
    console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));
  });
});
