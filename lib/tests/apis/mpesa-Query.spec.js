import { expect } from "chai";
import { mpesaQueryApi } from "./utils/init.js";
import { createOptionsForMpesaQuery } from "./utils/options.js";

// Requires you to pass the checkout ID of the previous MPESA C2B simulate API
describe("Lipa Na M-Pesa C2B query API", function () {
  this.timeout(15000);
  it("Should initiate Lipa Na M-pesa payment query, and receive a callback", async function () {
    const responseBody = await mpesaQueryApi(createOptionsForMpesaQuery("ws_CO_03112024094702738110081288"));
    expect(responseBody).to.be.an("object");
    console.log("RESPONSE BODY", JSON.stringify(responseBody, null, 2));
  });
});

