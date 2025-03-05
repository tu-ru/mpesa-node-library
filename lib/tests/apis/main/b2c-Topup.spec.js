import { expect } from "chai";
import { mpesa } from "../../../../index.js";
import { setupNgrokServer } from "../utils/server.js";
import { createOptionsForB2cAccTopUp } from "../utils/options.js";
/**
 * Tests the B2B Account Top-Up API with OAuth by simulating a single transaction.
 *
 * - Sets up a Ngrok server for callback handling.
 * - Sends a B2C top-up request to a business account.
 * - Verifies the response to ensure a successful transaction.
 * - Logs test success upon receiving a valid response.
 * - Handles both valid responses and timeout scenarios.
 */

describe("B2B Account Top-Up API with OAuth", function () {
  this.timeout(24000);
  let NGROK_URL, teardown;
  const { b2cTopUp } = mpesa;

  before(async function () {
    ({ NGROK_URL, teardown } = await setupNgrokServer("b2cTopUp", true));
  });

  after(async function () {
    await teardown();
  });

  it("Should simulate a B2C account top-up and receive result or timeout callback", function (done) {
    b2cTopUp(
      createOptionsForB2cAccTopUp(
        NGROK_URL === "" ? "https://mock.url" : NGROK_URL,
      ),
    )
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.b2cTopUpResponse.ResponseCode).to.be.equal("0");
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
