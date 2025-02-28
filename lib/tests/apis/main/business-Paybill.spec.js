import { expect } from "chai";
import { setupNgrokServer } from "../utils/server.js";
import { mpesa } from "../../../../index.js";
import { createOptionsForB2bPaybill } from "../utils/options.js";

describe("B2B Paybill API with OAuth", function () {
  this.timeout(24000);
  let NGROK_URL, teardown;
  const { businessPaybill } = mpesa;

  before(async function () {
    ({ NGROK_URL, teardown } = await setupNgrokServer("businessPaybill", true));
  });

  after(async function () {
    await teardown();
  });

  it("Should simulate a B2B paybill transaction and receive a response", function (done) {
    businessPaybill(
      createOptionsForB2bPaybill(
        NGROK_URL === "" ? "https://mock.url" : NGROK_URL,
      ),
    )
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.businessPaybillResponse.ResponseCode).to.be.equal(
          "1005",
        );
        console.log(
          "\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m",
          `Test passed successfully`,
        );
        /*console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));*/
        done();
      })
      .catch(done);
  });
});
