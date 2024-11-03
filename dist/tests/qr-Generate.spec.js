import { expect } from "chai";
import { generateQrCodeApi } from "./utils/init.js";
import { createOptionsForQrCode } from "./utils/options.js";

describe("Generate Dynamic QR Code API", function () {
  this.timeout(15000);

  it("Should generate a dynamic QR code successfully", async function () {
    const responseBody = await generateQrCodeApi(createOptionsForQrCode());
    expect(responseBody).to.be.an("object");
    console.log(
      "Generated dynamic QR code:",
      JSON.stringify(responseBody, null, 2),
    );
  });
});
