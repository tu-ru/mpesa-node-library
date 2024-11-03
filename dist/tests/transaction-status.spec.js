import { expect } from "chai";
import { setupNgrokServer } from "./utils/helpers.js";
import { transactionStatusApi } from "./utils/init.js";
import { createOptionsForTransactionStatusApi } from "./utils/options.js";
// import { emitter } from "./utils/server.js";

describe("Transaction Status API", function () {
  this.timeout(15000);
  let NGROK_URL, teardown;

  before(async function () {
    // Set up the Ngrok server
    const { NGROK_URL: url, teardown: td } = await setupNgrokServer();
    NGROK_URL = url;
    teardown = td;
  });

  after(async function () {
    // Execute teardown to disconnect ngrok and close server
    await teardown();
  });

  it("Should retrieve transaction status and receive result or timeout callback", async function () {
    // Send the transaction status request
    const responseBody = await transactionStatusApi(
      createOptionsForTransactionStatusApi(NGROK_URL),
    );
    expect(responseBody).to.be.an("object");
    console.log(
      "Initiated transaction status:",
      JSON.stringify(responseBody, null, 2),
    );
    /** IF YOU WANT TO LOG OUT THE RESULT BODY UNCOMMENT THE CODE BELOW **/
    /*    const resultBody = await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("No callback received within time limit")),
            30000
          );
          emitter.once("transactionStatusCallback", (data) => {
            clearTimeout(timeout);
            resolve({ type: "result", data });
          });
          emitter.once("queueTimeout", (data) => {
            clearTimeout(timeout);
            resolve({ type: "timeout", data });
          });
        });
        expect(resultBody).to.be.an("object");*/
  });
});
