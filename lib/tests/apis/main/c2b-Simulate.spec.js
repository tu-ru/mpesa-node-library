import { expect } from "chai";
import { mpesa } from "../../../../index.js";
import { createOptionsForC2bSimulate } from "../utils/options.js";

/**
 * Tests the C2B Simulate API with OAuth by initiating a customer-to-business transaction.
 *
 * - Sends a request to simulate a C2B payment.
 * - Validates the response to ensure the transaction was processed successfully.
 * - Logs test success upon receiving a valid response.
 * - Handles both successful responses and possible timeout scenarios.
 */

describe("C2B Simulate API with OAuth", function () {
  this.timeout(28000);
  const { c2bSimulate } = mpesa;
  it("Should simulate a C2B transaction", function (done) {
    c2bSimulate(createOptionsForC2bSimulate())
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.c2bSimulateResponse.ResponseCode).to.be.equal("0");
        console.log(
          "\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m",
          `Test passed successfully`,
        );
        // console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));
        done();
      })
      .catch(done);
  });
});
