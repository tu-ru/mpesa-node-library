import { expect } from "chai";
import { mpesa } from "../../../../index.js";
import { createOptionsForMpesaSimulate } from "../utils/options.js";
import { setupNgrokServer } from "../utils/server.js";

describe("Lipa Na M-Pesa C2B API with OAuth", function() {
  this.timeout(45000);
  let NGROK_URL, teardown;
  const { mpesaSimulate } = mpesa;

  before(async function() {
    ({ NGROK_URL, teardown } = await setupNgrokServer("mpesaSimulate", true));
  });

  after(async function() {
    await teardown();
  });

  it("Should initiate Lipa Na M-Pesa payment and return a response", function(done) {
    mpesaSimulate(createOptionsForMpesaSimulate(NGROK_URL === "" ? "https://mock.url" : NGROK_URL))
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.mpesaSimulateResponse.ResponseCode).to.be.equal("0");
        console.log("\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m", `Test passed successfully`);
        // console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));
        done();
      })
      .catch(done);
  });
});
