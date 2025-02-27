import { expect } from "chai";
import { setupNgrokServer } from "../utils/server.js";
import { mpesa } from "../../../../index.js";
import { createOptionsForC2bRegister } from "../utils/options.js";

describe("C2B Register URL API with OAuth", function() {
  this.timeout(15000);
  let NGROK_URL, teardown;
  const { c2bRegister } = mpesa;

  before(async function() {
    ({ NGROK_URL, teardown } = await setupNgrokServer("c2bRegister", true));
  });

  after(async function() {
    await teardown();
  });

  it("Should register C2B validation and confirmation URLs and confirm success", function(done) {
    c2bRegister(createOptionsForC2bRegister(NGROK_URL === "" ? "https://mock.url" : NGROK_URL))
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.c2bRegisterResponse.ResponseCode).to.be.equal("00000000");
        console.log("\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m", `Test passed successfully`);
        /*console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));*/
        done();
      })
      .catch(done);
  });
});
