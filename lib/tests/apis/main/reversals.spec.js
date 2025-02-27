import { expect } from "chai";
import { setupNgrokServer } from "../utils/server.js";
import { createOptionsForReversals } from "../utils/options.js";
import { mpesa } from "../../../../index.js";

describe("Reversal API Test", function() {
  this.timeout(28000);
  let NGROK_URL, teardown;
  const { reversals } = mpesa;

  before(async function() {
    ({ NGROK_URL, teardown } = await setupNgrokServer("reversals", true));
  });

  after(async function() {
    await teardown();
  });

  it("Should initiate a reversal and return a response", function(done) {
    reversals(createOptionsForReversals(NGROK_URL === "" ? "https://mock.url" : NGROK_URL, "OEI2AK4Q16"))
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.reversalsResponse.ResponseCode).to.be.equal("0");
        console.log("\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m", `Test passed successfully`);
        // console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));
        done();
      })
      .catch(done);
  });
});
