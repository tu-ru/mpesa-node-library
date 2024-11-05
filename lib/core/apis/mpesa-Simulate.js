import axios from "axios";
import {
  generateMpesaCredentials,
  generateOAuthToken,
  throwErrorMessages,
} from "../utils/helpers.js";

/**
 * Logs error details for advanced debugging.
 * @param {Error} error - The error object caught in the catch block.
 * @param {Object} context - Additional context about the API request, such as endpoint, method, and payload.
 */
function logErrorDetails(error, context) {
  console.error("Mpesa Simulate transaction error details:", {
    message: error.message,
    stack: error.stack,
    ...(error.response && {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    }),
    ...(error.request && { request: error.request }),
    context,
  });
}

/**
 * Lipa Na M-Pesa Online Payment - Initiates an online payment on behalf of a customer.
 * @name mpesaSimulateApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate Payment Request}
 * @param {Object} options - Options for the Lipa Na M-Pesa online payment request.
 * @param {number} options.msisdn1 - The MSISDN sending the funds.
 * @param {number} options.msisdn2 - The MSISDN receiving the STK pin prompt, can be similar to msisdn1.
 * @param {number} options.amount - The amount to be transacted.
 * @param {string} options.callbackUrl - Callback URL for payment notification.
 * @param {string} options.accountRef - Account Reference for the transaction.
 * @param {string} [options.transactionDesc='OK!'] - Description of the transaction.
 * @param {string} [options.transactionType='CustomerPayBillOnline'] - Transaction type.
 * @param {number} [options.shortCode] - Organization shortcode used to receive the transaction.
 * @returns {Promise<Object>} - Returns a promise that resolves to the payment response.
 */
async function mpesaSimulateApi({
  msisdn1,
  msisdn2,
  amount,
  callbackUrl,
  accountRef,
  transactionDesc = "OK!",
  transactionType = "CustomerPayBillOnline",
  shortCode,
}) {
  try {
    // Generate OAuth token
    const { accessToken, baseURL } = await generateOAuthToken();
    const { password, timeStamp } = generateMpesaCredentials(shortCode);

    // Prepare the request with OAuth token
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Make the request to M-Pesa API
    const response = await req.post("/mpesa/stkpush/v1/processrequest", {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timeStamp,
      Amount: amount,
      PartyA: msisdn1,
      PartyB: shortCode,
      PhoneNumber: msisdn2,
      CallBackURL: callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: transactionDesc,
      TransactionType: transactionType,
    });

    return response.data; // Return the response data directly
  } catch (error) {
    // Advanced error logging
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/stkpush/v1/processrequest",
      method: "POST",
      payload: {
        msisdn1,
        msisdn2,
        amount,
        callbackUrl,
        accountRef,
        transactionDesc,
        transactionType,
        shortCode,
      },
    });

    // Categorize and handle error types
    throwErrorMessages(error);
  }
}

export default mpesaSimulateApi;
