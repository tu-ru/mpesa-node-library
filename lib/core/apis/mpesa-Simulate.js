import axios from "axios";
import {
  callbackTrigger,
  generateMpesaCredentials,
  generateOAuthToken,
  handleCallbacks,
  logErrorDetails,
  throwErrorMessages,
  validateFormatPhone,
  validateUrl,
} from "../utils/helpers.js";

// Globals
let callbackHandlerInitialized = false;
let conditionalCallbackData = {};

/**
 * @name mpesaSimulate
 * @description Lipa na M-PESA online API also known as M-PESA express (STK Push/NI push) is a Merchant/Business initiated C2B (Customer to Business) Payment. it enables you to send a payment prompt on the customer's phone (Popularly known as STK Push Prompt) to your customer's M-PESA registered phone number requesting them to enter their M-PESA pin to authorize and complete payment.
 * @summary Sends a payment prompt to the customer's M-PESA registered phone number, requesting them to enter their M-PESA pin to authorize and complete payment.
 * @see {@link https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate open external link}
 * @param {Object} options Options for M-Pesa express API.
 * @param {string} options.partyA Sender's Safaricom mobile number (M-PESA registered).
 * @param {string} options.phoneNumber Mobile number to receive the STK Pin Prompt (can be same as partyA).
 * @param {number} options.amount Transaction amount.
 * @param {string} options.transactionType "CustomerPayBillOnline" for PayBill and "CustomerBuyGoodsOnline" for Till Numbers.
 * @param {string} options.callbackURL Secure URL for receiving notifications from M-Pesa API.
 * @param {string} options.transactionDesc Information to be associated with the transaction.
 * @param {string} options.accountRef Alphanumeric account reference (up to 12 characters) shown in the STK Pin Prompt (Org name).
 * @param {number} options.partyB 5 to 6-digit number of the receiving organization.
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @returns {Promise<Object>} mpesaSimulateResponse and (optional) conditionalCallbackData.
 */
async function mpesaSimulate({
  partyA,
  phoneNumber,
  amount,
  callbackURL,
  accountRef,
  partyB,
  transactionType,
  transactionDesc,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default callback handler ('handleMpesaSimulateCallbacks') was not called. Ignore if handling manually.\x1b[0m",
    );
  }
  try {
    validateUrl(callbackURL, "callbackURL");
    const { accessToken, baseURL } = await generateOAuthToken();
    const { password, timeStamp } = generateMpesaCredentials(partyB);
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const responseBody = await req.post("/mpesa/stkpush/v1/processrequest", {
      BusinessShortCode: partyB,
      Password: password,
      Timestamp: timeStamp,
      Amount: amount,
      PartyA: validateFormatPhone(partyA),
      PartyB: partyB,
      PhoneNumber: validateFormatPhone(phoneNumber),
      CallBackURL: callbackURL,
      AccountReference: accountRef,
      TransactionDesc: transactionDesc,
      TransactionType: transactionType,
    });
    conditionalCallbackData = await callbackTrigger(
      callbackHandlerInitialized,
      true,
    );
    return {
      mpesaSimulateResponse: responseBody.data,
      conditionalCallbackData,
    };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for mpesaSimulate has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/stkpush/v1/processrequest",
          method: "POST",
          payload: {
            partyA,
            phoneNumber,
            amount,
            callbackURL,
            accountRef,
            partyB,
            transactionDesc,
          },
        },
        "Mpesa Simulate transaction error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}

const handleMpesaSimulateCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "mpesaSimulate");
};
export { mpesaSimulate, handleMpesaSimulateCallbacks };
