import { expect } from "chai";
import { mpesa } from "../../../../index.js";
import { setupNgrokServer } from "../utils/server.js";
import { createOptionsForB2c } from "../utils/options.js";

describe("B2C Payment API with OAuth", function () {
  this.timeout(24000);
  let NGROK_URL, teardown;
  const { b2cRequest } = mpesa;

  before(async function () {
    ({ NGROK_URL, teardown } = await setupNgrokServer("b2cRequest", true));
  });

  after(async function () {
    await teardown();
  });

  it("Should send multiple B2C payments in parallel and receive results or timeout callback", function (done) {
    const urlToUse = NGROK_URL === "" ? "https://mock.url" : NGROK_URL;
    // This simulates a bulk payment such as paying salaries
    Promise.all([
      b2cRequest(createOptionsForB2c(urlToUse, "0789885845")),
      b2cRequest(createOptionsForB2c(urlToUse, "0756284523")),
      b2cRequest(createOptionsForB2c(urlToUse, "0741585228")),
    ])
      .then(([responseBody1, responseBody2, responseBody3]) => {
        [responseBody1, responseBody2, responseBody3].forEach(
          (responseBody, index) => {
            expect(responseBody).to.be.an("object");
            expect(responseBody?.b2cRequestResponse.ResponseCode).to.be.equal(
              "0",
            );
            console.log(
              "\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m",
              `Test ${index + 1} passed successfully`,
            );
            // console.log(`RESPONSE BODY ${index + 1}:`, JSON.stringify(responseBody, null, 2));
          },
        );
        done();
      })
      .catch(done);
  });
});
