import { expect } from "chai";
import { mpesaSimulateApi } from "./utils/init.js";
import { createOptionsForMpesaSimulate } from "./utils/options.js";
import { setupNgrokServer } from "./utils/helpers.js";
import { emitter } from "./utils/server.js";

describe("Lipa Na M-Pesa C2B API with OAuth", function () {
  this.timeout(45000);
  let NGROK_URL, teardown;

  before(async function () {
    const { NGROK_URL: url, teardown: td } = await setupNgrokServer();
    NGROK_URL = url;
    teardown = td;
  });
  after(async function () {
    // Execute teardown to disconnect ngrok and close server
    await teardown();
  });

  it("Should initiate Lipa Na M-Pesa payment and receive a callback", async function () {
    const responseBody = await mpesaSimulateApi(
      createOptionsForMpesaSimulate(NGROK_URL),
    );
    expect(responseBody).to.be.an("object");
    console.log("Initiated payment:", JSON.stringify(responseBody, null, 2));

    /** IF YOU WANT TO LOG OUT THE RESULT BODY UNCOMMENT THE CODE BELOW **/
     const resultBody = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('No callback received within time limit')), 30000)
      emitter.once('mpesaSimulateCallback', (data) => {
        clearTimeout(timeout)
        resolve(data)
      })
      emitter.once('queueTimeout', (data) => {
        clearTimeout(timeout)
        resolve(data)
      })
    })
    expect(resultBody).to.be.an('object')
  });
});
