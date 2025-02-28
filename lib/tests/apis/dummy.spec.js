import { expect } from "chai";
import sinon from "sinon";
import { mpesa } from "../../../index.js";
import { createOptionsForB2c } from "./utils/options.js";

describe("B2C Payment API - Mocked Test", function () {
  this.timeout(5000);

  beforeEach(function () {
    const stub = sinon.stub(mpesa, "b2cRequest").resolves({
      b2cRequestResponse: {
        ResponseCode: "0",
        ResponseDescription: "Request processed successfully",
        OriginatorConversationID: "AG_20250224_201067702c0820b0b3b5",
      },
      conditionalCallbackData: {},
    });

    console.log("Is stub (mocking) working?", stub.isSinonProxy); // Should log true
  });

  afterEach(function () {
    // Restore original function
    sinon.restore();
  });

  it("Should return a mocked B2C payment response", function (done) {
    mpesa
      .b2cRequest(createOptionsForB2c("https://mock-callback.url"))
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody.b2cRequestResponse.ResponseCode).to.equal("0");
        console.log(
          "MOCKED RESPONSE BODY:",
          JSON.stringify(responseBody, null, 2),
        );
        done();
      })
      .catch(done);
  });
});
