import { setupNgrokServer } from "../utils/server.js";
import { mpesa } from "../../../../index.js";
import { createOptionsForTaxRemittance } from "../utils/options.js";
import { expect } from "chai";

describe("Tax remittance API with OAuth ", function () {
  this.timeout(15000);
  let NGROK_URL, teardown;
  const { taxRemittance } = mpesa;
  before(async function () {
    ({ NGROK_URL, teardown } = await setupNgrokServer("taxRemittance", true));
  });
  after(async function () {
    await teardown();
  });

  it("Should simulate tax remittance to KRA and receive a response body and result body", function (done) {
    taxRemittance(createOptionsForTaxRemittance(NGROK_URL))
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.remittanceResponse.ResponseCode).to.be.equal("0");
        console.log(
          "\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m",
          `Test passed successfully`,
        );
        // console.log("RESPONSE BODY", JSON.stringify(responseBody, null, 2));
        done();
      })
      .catch(done);
  });
});
