import { expect } from "chai";
import { setupNgrokServer } from "./utils/helpers.js";
import { b2cRequestApi } from "./utils/init.js";
import { createOptionsForB2c } from "./utils/options.js";
// import { emitter } from "./utils/server.js";

describe("B2C Payment API with OAuth", function () {
  this.timeout(30000);
  let NGROK_URL, teardown;

  before(async function () {
    // Set up the Ngrok server and retrieve NGROK_URL and teardown function
    const { NGROK_URL: url, teardown: td } = await setupNgrokServer();
    NGROK_URL = url;
    teardown = td;
  });

  after(async function () {
    // Execute teardown to disconnect ngrok and close server
    await teardown();
  });

  it("Should send B2C payment and receive result or timeout callback", async function () {
    // Hit the B2C Payment API
    const responseBody = await b2cRequestApi(createOptionsForB2c(NGROK_URL));
    expect(responseBody).to.be.an("object");
    console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));

    /** IF YOU WANT TO LOG OUT THE RESULT BODY UNCOMMENT THE CODE BELOW **/
    /*const resultBody = await new Promise((resolve, reject) => {
      let timeout = setTimeout(() => reject(new Error('No callback received within time limit')), 15000)

      emitter.once('b2cRequestCallback', (data) => {
        clearTimeout(timeout)
        resolve({ type: 'result', data })
      })

      emitter.once('queueTimeout', (data) => {
        clearTimeout(timeout)
        resolve({ type: 'timeout', data })
      })
    })
    expect(resultBody).to.be.an('object')*/
  });
});
