import { expect } from "chai";
import { setupNgrokServer } from "../utils/server.js";
import { mpesa } from "../../../../index.js";
import { createOptionsForBalance } from "../utils/options.js";

describe("Account Balance API with OAuth", function () {
  this.timeout(24000);
  let NGROK_URL, teardown;
  const { balanceQuery } = mpesa;

  before(async function () {
    ({ NGROK_URL, teardown } = await setupNgrokServer("balanceQuery", true));
  });

  after(async function () {
    await teardown();
  });

  it("Should fetch account balance and receive result or timeout callback", function (done) {
    balanceQuery(
      createOptionsForBalance(
        NGROK_URL === "" ? "https://mock.url" : NGROK_URL,
      ),
    )
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.balanceQueryResponse.ResponseCode).to.be.equal(
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
