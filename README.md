# Node.js M-Pesa API

**M-Pesa Library for Node.js using REST API**

![Node Mpesa Rest API](https://i.imghippo.com/files/fQO9155Kic.jpg
)
<div style="display: flex; justify-content: flex-end;">
<img width="96" height="96" src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="JavaScript Logo"/>
</div>

[![Made in Africa](https://img.shields.io/badge/Africa's%20Rising-%E2%9C%93-green.svg)](https://github.com/collections/made-in-africa)
[![Known Vulnerabilities](https://snyk.io/test/github/safaricom/mpesa-node-library/badge.svg?targetFile=package.json)](https://snyk.io/test/github/safaricom/mpesa-node-library?targetFile=package.json)
[![npm downloads](https://img.shields.io/npm/dt/your-package-name.svg)](https://www.npmjs.com/package/mpesa-node)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Prerequisites

* **Node.js v20+** – Ensure you have Node.js version 20 or later installed for improved performance, security, and
  compatibility.
* **Ngrok CLI** – Install the [**Ngrok CLI**](https://download.ngrok.com/) to expose your local server for testing M-Pesa
  callbacks. Ensure you have followed the official guide on how to setup Ngrok

## Installation

Based on the **package manager** you prefer, run the commands below, to install all necessary dependencies

**npm**: `npm install`

**Yarn**: `yarn install`

## Pre-Usage

**Please make sure you have read the documentation on [Daraja](https://developer.safaricom.co.ke/home) before
continuing.**

You need to sign up for a Safaricom developer [**account**](https://developer.safaricom.co.ke/home) to obtain your **Consumer Key** and **Consumer Secret**. In addition, you'll need to download the **sandbox encryption certificate** to
test the APIs in your project. For production or **going live** you'll be issued with a **production encryption
certificate**

For convenience, the sandbox certificate required for testing the library is already provided in the `libs/cert`
directory _**(For testing the library itself)**_. In your own project, I recommend one to specify the certificate path
in the `.env` for either **production** or **sandbox - development mode**.

For example, your .env file might look like this:

```dotenv
# For sandbox/development
MPESA_CERT_PATH_DEV=./path/to/your/sandbox-cert.pem
# For production
MPESA_CERT_PATH_PROD=./path/to/your/production-cert.pem
```

## Getting Started

**Note:** This library follows a **modular approach**, allowing you to import only the **specific functions or endpoints** you need. Before getting started, make sure the following steps are **properly set up** ✔.

### Setting up environmental credentials

A `.env` file in your project's root directory is required to configure the **M-Pesa API** credentials. This file **should**
contain the following environment variables

```dotenv
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SECURITY_CREDENTIAL=your_encrypted_credential
MPESA_PASS_KEY=your_pass_key
MPESA_CERT_PATH_DEV=./certs/dev-cert.pem
MPESA_CERT_PATH_PROD=./certs/prod-cert.pem
ENVIRONMENT=sandbox
```

The `MPESA_PASS_KEY` Can be found specifically here [**Daraja**](https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate) - _(my Apis - MpesaExpressSimulate)_. Click on the **console**, select an app, scroll down you'll see the field labeled `passKey`

**Note for Library Developers**: If you're contributing to or working on the **M-Pesa** library itself, place a
`.env.local` or `.env` file in the `lib/tests` directory to run the included tests. This is not required for simply using the APIs
in your own projects.

## Simulating an account balance check:

You can simulate an account balance check by importing and calling the `balanceQuery` function, together with its
callback handler (optional) `handleBalanceQueryCallbacks`

**TypeScript Support:** This library has a `.d.ts` for each **API endpoint**, providing seamless integration and type
checking for TypeScript projects.

Below is an example of how to setup the account balance api endpoint `balanceQuery`:

```js
import { mpesa } from "mpesa-node";

// Account Balance Query Example
/**
 * @name balanceQuery
 * @description Fetches the account balance from M-Pesa.
 * @see {@link https://developer.safaricom.co.ke/APIs/AccountBalance} - Daraja API Documentation
 */

const { balanceQuery } = mpesa;

// Ensure you replace these placeholders with valid values
// For the url, check on how to handle callbacks, paste the url provided below 
const VALID_HTTPS_URL = "paste here"; 
const INITIATOR_NAME = "yourInitiatorUsername";

async function checkAccountBalance() {
  try {
    const response = await balanceQuery({
      idType: 2, // Example: 2 (Till Number)
      shortCode: 600977,
      initiator: INITIATOR_NAME,
      queueUrl: `${VALID_HTTPS_URL}/accountbalance/queuetimeouturl`,
      resultUrl: `${VALID_HTTPS_URL}/accountbalance/result`,
    });
    //do something ...
    console.log("Account Balance Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    //do something...
    console.error("Error fetching account balance:", error);
  }
}
// Execute the function
checkAccountBalance();
```

### Handling callbacks

After setting up the `balanceQuery` endpoint, lets configure the callback handler associated with it; `handleBalanceQueryCallbacks`. A **server instance** is required to use callback handlers
. For this to work, ensure you have **ngrok CLI**
installed on your machine, see [**getting started with Ngrok**](https://ngrok.com/docs/getting-started/)

Using the library's default callback handlers is **completely optional**—you're free to handle them `manually` if
preferred.

```js
import express from "express";
import { callbacks } from "mpesa-node";

const app = express();
const { handleBalanceQueryCallbacks } = callbacks;

// Middleware for parsing JSON requests
app.use(express.json());

// Register M-Pesa balance query callback handler
handleBalanceQueryCallbacks(app);

/**
 * STARTING THE SERVER
 * -------------------
 * - The server listens on port 3000 (or an environment-defined port)
 * - Developers can use tools like `ngrok` to expose the server publicly for testing callbacks
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`To expose this locally, run: ngrok http ${PORT}`);
  console.log(`Ensure the public URL provided by ngrok is set as the 'resultUrl' and 'queueUrl' in your M-Pesa request`);
});
```

When using the default **callback handlers**, the response includes the main API `balanceQuery` response body, along with either a **result** or **queue** callback body.

```js
 const response = await balanceQuery({
      idType: 2, // Example: 2 (Till Number)
      shortCode: 600977,
      initiator: INITIATOR_NAME,
      queueUrl: `${VALID_HTTPS_URL}/accountbalance/queuetimeouturl`,
      resultUrl: `${VALID_HTTPS_URL}/accountbalance/result`,
    });
    //do something ...
    console.log("Account Balance Response:", JSON.stringify(response, null, 2));
    /*
        if callback handlers are used expect such a json response...
        "Account balance response": {
          "balanceResponse": {
            ...some data
          },
        "conditionalCallbackData": {
            "type": "result or queue",
                "data": {
                  ...some data
                }
            }
        }
        if callback handlers aren't used simply expect
        "Account balance response": {
          "balanceResponse": {
            ...some data
          },
          "conditionalCallbackData": {}
    */
```

**NOTE**: At all costs avoid using URLs offered by **Ngrok** for **production** or **going live**


## Supported API endpoints:

#### Caution!

This library is still in development. We recommend **thorough testing** before using it in a **production environment**.

Here is a comprehensive list of all supported API endpoints with their respective documentation links:

- **balanceQuery**: [**Daraja**](https://developer.safaricom.co.ke/APIs/AccountBalance)
  or [**JsDocs**](./docs/balance-Query.js.html)
- **b2cRequest**: [**Daraja**](https://developer.safaricom.co.ke/APIs/BusinessToCustomer)
  or [**JsDocs**](./docs/b2c-Request.js.html)
- **c2bRegister**: [**Daraja**](https://developer.safaricom.co.ke/APIs/CustomerToBusinessRegisterURL)
  or [**JsDocs**](./docs/c2b-Register.js.html)
- **c2bSimulate**: [**Daraja**](https://developer.safaricom.co.ke/c2b/apis/post/simulate)
  or [**JsDocs**](./docs/c2b-Simulate.js.html)
- **mpesaSimulate**: [**Daraja**](https://developer.safaricom.co.ke/c2b/apis/post/simulate)
  or [**JsDocs**](./docs/c2b-Simulate.js.html)
- **mpesaQuery**: [**Daraja**](https://developer.safaricom.co.ke/c2b/apis/post/simulate)
  or [**JsDocs**](./docs/c2b-Simulate.js.html)
- **reversals**: [**Daraja**](https://developer.safaricom.co.ke/APIs/MpesaExpressQuery)
  or [**JsDocs**](./docs/reversals.js.html)
- **generateQrCode**: [**Daraja**](https://developer.safaricom.co.ke/APIs/DynamicQRCode)
  or [**JsDocs**](./docs/qr-Generate.js.html)
- **transactionStatus**: [**Daraja**](https://developer.safaricom.co.ke/transaction-status/apis/post/query)
  or [**JsDocs**](./docs/transaction-Status.js.html)
- **b2cTopUp**: [**Daraja**](https://developer.safaricom.co.ke/transaction-status/apis/post/query)
  or [**JsDocs**](./docs/b2c-Topup.js.html)
- **businessPaybill**: [**Daraja**](https://developer.safaricom.co.ke/APIs/BusinessPayBill)
  or [**JsDocs**](./docs/business-Paybill.js.html)
- **taxRemittance**: [**Daraja**](https://developer.safaricom.co.ke/APIs/TaxRemittance)
  or [**JsDocs**](https://developer.safaricom.co.ke/APIs/TaxRemittance)

Developers are strongly encouraged to consult the [**JsDocs**](./docs/global.html) (_which comes bundled with the library_) for detailed information on how the required fields are mapped. This documentation clearly outlines the necessary configurations for successfully initiating any endpoint, ensuring a smooth integration process.

### Options for each API
Here is a comprehensive list of all supported APIs along with their respective **options**. Use this as a reference when configuring the parameters for your chosen API.
```ts
export interface balanceQueryOptions {
  partyA: number;
  identifierType: number;
  QueueTimeOutUrl: string;
  resultUrl: string;
  initiator: string;
  remarks: string;
}

export interface b2cRequestOptions {
  partyA: number;
  partyB: string;
  amount: number;
  QueueTimeOutUrl: string;
  resultUrl: string;
  commandId: string;
  initiatorName: string;
  remarks: string;
  occasion: string;
}

export interface c2bRegisterOptions {
  confirmationUrl: string;
  validationUrl: string;
  shortCode: number;
  responseType: string;
}

export interface c2bSimulateOptions {
  msisdn: string;
  amount: number;
  billRefNumber: string;
  shortCode: number;
}

export interface mpesaSimulateOptions {
  partyA: string;
  phoneNumber: string;
  amount: number;
  callbackUrl: string;
  accountRef: string;
  transactionType: string;
  partyB: number;
  transactionDesc: string;
}

export interface mpesaQueryOptions {
  checkoutRequestId: string;
  businessShortCode: number;
}

export interface reversalsOptions {
  transactionId: string;
  amount: number;
  QueueTimeOutUrl: string;
  resultUrl: string;
  receiverParty: string;
  initiator: string;
  receiverIdType: string;
  remarks: string;
  occasion: string;
}

export interface transactionStatusOptions {
  transactionId: string;
  partyA: number;
  identifierType: number;
  QueueTimeOutUrl: string;
  resultUrl: string;
  initiator: string;
  OriginatorConversationID: string;
  remarks: string;
  occasion: string;
}

export interface generateQrCodeOptions {
  merchantName: string;
  refNo: string;
  amount: number;
  trxCode: "BG" | "WA" | "PB" | "SM" | "SB";
  cpi: string;
  size: string;
}

export interface b2cTopUpOptions {
  initiator: string;
  amount: number;
  partyA: number;
  partyB: number;
  accountReference: number;
  requester?: number;
  QueueTimeOutURL: string;
  resultURL: string;
  remarks: string;
}

export interface businessPaybillOptions {
  initiator: string;
  amount: number;
  partyA: number;
  partyB: number;
  accountReference: number;
  requester?: number;
  QueueTimeOutURL: string;
  resultURL: string;
  remarks: string;
}

export interface taxRemittanceOptions {
  initiator: string;
  amount: number;
  partyA: number;
  partyB: number;
  accountReference: number;
  QueueTimeOutURL: string;
  resultURL: string;
  remarks: string;
}
```
### MSISDN formatting
When working with APIs that require an `msisdn` (a **phone number**), always provide it as a `string` in the format: `0708374149`. The library automatically processes the number into the required format, so no additional configuration is needed.

### External configurations
Certain endpoints require external configurations to function correctly, particularly when working in a production environment. For seamless integration and optimal performance, it is crucial to review the API documentation thoroughly. Some APIs, such as **taxRemittance**, **b2cRequest** and **c2bRegister**, may depend on additional setup or external parameters that are necessary for proper functionality.

In a **production development** setting, these configurations are especially critical to ensure that all aspects of the API perform as expected. It is highly recommended that developers pay close attention to the specific requirements outlined in the [**official documentation**](https://developer.safaricom.co.ke/APIs) for each API. Relying on the most up-to-date and detailed guidelines from the official sources will help mitigate potential issues and ensure smooth integration.

## Testing

This library is built around **integration tests**, following a **Behavior-Driven Development (BDD)** approach.

This approach is ideal for a wide range of audiences because **BDD focuses** on clear, human-readable test scenarios
that describe expected behaviors. Additionally, integration tests validate real-world interactions, ensuring the library
works reliably in actual usage scenarios.

**BDD approach** + **on integration tests**, can help:

* Catch authentication issues (**OAuth failures**)
* Verify actual API responses (**instead of mocked ones**)
* Check if callbacks are received & handled properly
* Detect network timeouts or incorrect response formats

To run tests, first, **clone this repository**.

The command below (_based on your package manager_) executes **integration tests**, which **require an active internet
connection** to accurately simulate **real API interactions** over **HTTPS**.

**npm**: `npm test`

**Yarn**: `yarn test`

### Activating callback handlers in tests

Callback handlers in **testing** are automatically configured but **disabled** by default. 

Below is an example of a `c2bSimulate` **mocha** test. To activate callback handling swap `true` to `false`.

```js
import { expect } from "chai";
import { mpesa } from "../../../../index.js";
import { setupNgrokServer } from "../utils/server.js";
import { createOptionsForC2bSimulate } from "../utils/options.js";

describe("C2B Simulate API with OAuth", function() {
  this.timeout(28000);
  let NGROK_URL, teardown;
  const { c2bSimulate } = mpesa;

  // To enable callback handling swap true to false
  before(async function() {
    // ({ NGROK_URL, teardown } = await setupNgrokServer("c2bSimulate", true)); 
    ({ NGROK_URL, teardown } = await setupNgrokServer("c2bSimulate", false)); 
  });

  after(async function() {
    await teardown();
  });

  it("Should simulate a C2B transaction", function(done) {
    c2bSimulate(createOptionsForC2bSimulate(NGROK_URL === "" ? "https://mock.url" : NGROK_URL))
      .then((responseBody) => {
        expect(responseBody).to.be.an("object");
        console.log("RESPONSE BODY:", JSON.stringify(responseBody, null, 2));
        done();
      })
      .catch(done);
  });
});

```

### Temporary port exposure

Once the callback handler is enabled, the boolean option (`false` allows the test to temporarily:

* Spawn a local server
* Expose it via Ngrok
* Fetch responses from API endpoint servers

This setup ensures that callbacks are properly handled during testing.

## Production environment (Going live)

Before **deploying** to **production**, successful **sandbox testing** is essential. We **expect** the library to behave
**consistently** in both environments, with the key difference being that production callbacks will contain real
transaction data, whereas sandbox callbacks return simulated responses.

To **go live**, log in to [**Daraja**](https://developer.safaricom.co.ke/) and click on
the "[**Going Live**](https://developer.safaricom.co.ke/GoLive)" option.

For this to work properly, you need to tweak the `ENVIRONMENT` option to `"production"` and `MPESA_CERT_PATH_PROD` to a
valid `"/production.cer"` path, in the `.env` file:

```dotenv
ENVIRONMENT=production
MPESA_CERT_PATH_PROD=./path/to/your/production-cert.pem
```

## Pending Stuff

- [x] **Integration Tests**
- [x] **Deploy to Npm**
- [x] **Detailed Documentation**
- [x] **Typescript Definitions**
- [x] **Validators for MSISDN and URLs**
- [ ] **Production testing**

## Contributing

We welcome **contributions**! Follow these steps to get started:

1. **Create** your feature branch: `git checkout -b my-new-feature`
2. **Commit** your changes: `git commit -m 'Add some feature'`
3. **Push** to the branch: `git push origin my-new-feature`
4. Open a **pull request** and share your updates

## Credits

**Contributors**

* [DGatere](https://github.com/DGatere)
* [geofmureithi](https://github.com/geofmureithi)
* [Waturu Samm](https://github.com/tu-ru/)

## License

MIT
