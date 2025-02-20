import { setupNgrokServer } from "./utils/helpers.js";
import { b2bTopUpApi } from "./utils/init.js";
import { createOptionsForB2bAccTopUp } from "./utils/options.js";
import { expect } from "chai";
import { emitter } from "./utils/server.js";

describe("B2B Account top up API with OAuth ", function () {
  this.timeout(15000);
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

  it("Should simulate a B2B account top up and receive a response body and result body", async function () {
    const responseBody = await b2bTopUpApi(
      createOptionsForB2bAccTopUp(NGROK_URL),
    );
    expect(responseBody).to.be.an("object");
    console.log("RESPONSE BODY", JSON.stringify(responseBody, null, 2));

    /** IF YOU WANT TO LOG OUT THE RESULT BODY UNCOMMENT THE CODE BELOW **/
    /*    const resultBody = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('No callback received within time limit')), 30000)
          emitter.once('b2bTopUpCallback', (data) => {
            clearTimeout(timeout)
            resolve(data)
          })
          emitter.once('queueTimeout', (data) => {
            clearTimeout(timeout)
            resolve(data)
          })
        })
        // Validate the received data
        expect(resultBody).to.be.an('object')*/
  });
});
