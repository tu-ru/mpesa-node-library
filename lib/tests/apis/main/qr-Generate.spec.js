import { expect } from "chai";
import { mpesa } from "../../../../index.js";
import { createOptionsForQrCode } from "../utils/options.js";

describe("Generate Dynamic QR Code API", function () {
  this.timeout(24000);
  const { generateQrCode } = mpesa;

  it("Should generate a dynamic QR code successfully", function (done) {
    generateQrCode(createOptionsForQrCode())
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        console.log("\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m", `Test passed successfully`);
        // console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));
        done();
      })
      .catch(done);
  });
});
