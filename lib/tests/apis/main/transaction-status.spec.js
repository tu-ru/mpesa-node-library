import { expect } from "chai";
import { setupNgrokServer } from "../utils/server.js";
import { mpesa } from "../../../../index.js";
import { createOptionsForTransactionStatus } from "../utils/options.js";
/**
 * Tests the Transaction Status API.
 *
 * - Sends a request to retrieve the status of a transaction.
 * - Verifies that the response is a valid object.
 * - Ensures the response code indicates a successful transaction status check.
 * - Logs success if the test passes.
 * - Handles potential errors or timeout scenarios.
 */

describe("Transaction Status API", function () {
  this.timeout(24000);
  let NGROK_URL, teardown;
  const { transactionStatus } = mpesa;

  before(async function () {
    ({ NGROK_URL, teardown } = await setupNgrokServer(
      "transactionStatus",
      true,
    ));
  });

  after(async function () {
    await teardown();
  });

  it("Should retrieve transaction status and return a response", function (done) {
    transactionStatus(
      createOptionsForTransactionStatus(
        NGROK_URL === "" ? "https://mock.url" : NGROK_URL,
      ),
    )
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.transactStatusResponse.ResponseCode).to.be.equal(
          "0",
        );
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
