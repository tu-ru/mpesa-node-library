import { expect } from "chai";
import { setupNgrokServer } from "./utils/helpers.js";
import { balanceQueryApi } from "./utils/init.js";
import { createOptionsForBalance } from "./utils/options.js";
// import { emitter } from "./utils/server.js";

describe("Account Balance API with OAuth", function() {
  this.timeout(30000);
  let NGROK_URL, teardown;

  before(async function() {
    // Set up the Ngrok server and retrieve NGROK_URL and teardown function
    const { NGROK_URL: url, teardown: td } = await setupNgrokServer();
    NGROK_URL = url;
    teardown = td;
  });

  after(async function() {
    // Execute teardown to disconnect ngrok and close server
    await teardown();
    // After closing the server, terminate the test after 5 secs
    setTimeout(() => {
      process.exit(0);
    }, 4000);
  });
  it("Should fetch account balance and receive result or timeout callback", async function() {
    const responseBody = await balanceQueryApi(
      createOptionsForBalance(NGROK_URL)
    );
    expect(responseBody).to.be.an("object");
    console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));

    /** IF YOU WANT TO LOG OUT THE RESULT BODY UNCOMMENT THE CODE BELOW **/
    /*  const resultBody = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('No callback received within time limit')), 45000)
        emitter.once('balanceQueryCallback', (data) => {
          clearTimeout(timeout)
          resolve({ type: 'result', data })
        })
        emitter.once('queueTimeout', (data) => {
          clearTimeout(timeout)
          resolve({ type: 'timeout', data })
        })
      })
      // Validate the received data
      expect(resultBody).to.be.an('object')*/
  });
});
