import { expect } from "chai";
import { setupNgrokServer } from "./utils/helpers.js";
import { c2bRegisterApi } from "./utils/init.js";
import { createOptionsForC2bRegister } from "./utils/options.js";
// import { emitter } from "./utils/server.js";

describe("C2B Register URL API with OAuth", function () {
  this.timeout(15000);
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
  it("Should register C2B validation and confirmation URLs and confirm success", async function () {
    // Hit the C2B Register URL API
    const responseBody = await c2bRegisterApi(
      createOptionsForC2bRegister(NGROK_URL),
    );
    expect(responseBody).to.be.an("object");
    console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));

    /** IF YOU WANT TO LOG OUT THE RESULT BODY UNCOMMENT THE CODE BELOW **/
    /*  const resultBody = await new Promise((resolve, reject) => {
        let timeout = setTimeout(() => reject(new Error('No callback received within time limit')), 15000)
        emitter.once('c2bResult', (data) => {
          clearTimeout(timeout)
          resolve({ type: 'result', data })
        })
      })
      expect(resultBody).to.be.an('object')*/
  });
});
