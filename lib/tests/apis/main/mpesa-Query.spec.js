import { expect } from "chai";
import { mpesa } from "../../../../index.js";
import { createOptionsForMpesaQuery } from "../utils/options.js";

describe("Lipa Na M-Pesa Query API", function() {
  this.timeout(24000);
  const { mpesaQuery } = mpesa;
  it("Should initiate Lipa Na M-Pesa payment query and return a response", function(done) {
    mpesaQuery(
      createOptionsForMpesaQuery("ws_CO_25022025092305896110081288")
    )
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        expect(responseBody?.mpesaQueryResponse.ResponseCode).to.be.equal("0");
        console.log("\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m", `Test passed successfully`);
        // console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));
        done();
      })
      .catch(done);
  });
});
