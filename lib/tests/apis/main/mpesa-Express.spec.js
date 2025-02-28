import { expect } from "chai";
import { mpesa } from "../../../../index.js";
import {
  createOptionsForMpesaQuery,
  createOptionsForMpesaSimulate,
} from "../utils/options.js";
import { setupNgrokServer } from "../utils/server.js";

describe("M-pesa express (simulate) and Query", function () {
  this.timeout(15000);
  let NGROK_URL, teardown;
  const { mpesaSimulate, mpesaQuery } = mpesa;

  before(async function () {
    ({ NGROK_URL, teardown } = await setupNgrokServer("mpesaSimulate", true));
  });

  after(async function () {
    await teardown();
  });

  it("Should initiate an M-Pesa payment then pass CheckoutRequestID to M-Pesa Query", function (done) {
    mpesaSimulate(
      createOptionsForMpesaSimulate(
        NGROK_URL === "" ? "https://mock.url" : NGROK_URL,
      ),
    )
      .then((simulateResponse) => {
        expect(simulateResponse).to.be.an("object");
        expect(simulateResponse?.mpesaSimulateResponse.ResponseCode).to.equal(
          "0",
        );

        console.log(
          "\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m",
          "Test for M-Pesa simulate passed successfully",
        );
        // console.log("Simulate Response:", JSON.stringify(simulateResponse, null, 2));

        return new Promise((resolve) => {
          console.log(
            "\x1b[45m\x1b[1m%s\x1b[0m",
            " Waiting for 6 seconds before the request is transacted... ",
          );
          setTimeout(() => resolve(simulateResponse), 6000);
        });
      })
      .then((simulateResponse) => {
        return mpesaQuery(
          createOptionsForMpesaQuery(
            simulateResponse.mpesaSimulateResponse.CheckoutRequestID,
          ),
        );
      })
      .then((queryResponse) => {
        expect(queryResponse).to.be.an("object");
        expect(queryResponse?.mpesaQueryResponse.ResponseCode).to.equal("0");

        console.log(
          "\x1b[35m\x1b[4m\x1b[1m%s\x1b[0m",
          "Test for M-Pesa query passed successfully",
        );
        // console.log("Query Response:", JSON.stringify(queryResponse, null, 2));

        done();
      })
      .catch(done);
  });
});
