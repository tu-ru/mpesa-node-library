import { expect } from "chai";
import { setupNgrokServer } from "./utils/helpers.js";
import { reversalsApi } from "./utils/init.js";
import { createOptionsForReversals } from "./utils/options.js";
// import { emitter } from "./utils/server.js";

describe("Reversal API Test", function () {
  this.timeout(30000);
  let NGROK_URL, teardown;

  before(async function () {
    // Set up Ngrok server and retrieve NGROK_URL and teardown function
    const { NGROK_URL: url, teardown: td } = await setupNgrokServer();
    NGROK_URL = url;
    teardown = td;
  });

  after(async function () {
    // Teardown ngrok and close server
    await teardown();
  });

  it("Should initiate a reversal and receive a result or timeout callback", async function () {
    // Send the reversal request
    const responseBody = await reversalsApi(
      createOptionsForReversals(NGROK_URL),
    );
    expect(responseBody).to.be.an("object");
    console.log(
      "Initiated reversal request:",
      JSON.stringify(responseBody, null, 2),
    );
    /** IF YOU WANT TO LOG OUT THE RESULT BODY UNCOMMENT THE CODE BELOW **/
    /*const resultBody = await new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("No callback received within time limit")),
        45000,
      );
      emitter.once("reversalsCallback", (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
      emitter.once("queueTimeout", (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    expect(resultBody).to.be.an("object");*/
  });
});
