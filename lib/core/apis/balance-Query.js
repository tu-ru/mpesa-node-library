import axios from "axios";
import {
  encryptSecurityCredential,
  generateOAuthToken,
  throwErrorMessages,
} from "../utils/helpers.js";
/**
 * Logs error details for advanced debugging.
 * @param {Error} error - The error object caught in the catch block.
 * @param {Object} context - Additional context about the API request, such as endpoint, method, and payload.
 */
function logErrorDetails(error, context) {
  console.error("Error Details:", {
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
 * AccountBalance - Use this API to enquire the balance on an M-Pesa BuyGoods (Till Number).
 * Simultaneously generates an OAuth token using the consumer key and secret.
 * @name balanceQueryApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/AccountBalance Balance Request}
 * @param {Object} options - Options for the account balance query.
 * @param {number} options.shortCode - The organization’s short code (Till Number) to check the balance for.
 * @param {number} options.idType - The type of organization receiving the transaction.
 * @param {String} options.queueUrl - URL for timeout notification on transaction failure.
 * @param {String} options.resultUrl - URL for notification of the transaction result.
 * @param {String} [options.remarks='Checking account balance'] - Optional remarks sent with the transaction.
 * @param {String} [options.initiator=null] - Name of the person/system initiating the request (defaults to configured initiator).
 * @return {Promise<Object>} - Returns a promise that resolves to the account balance or transaction status.
 */

async function balanceQueryApi({
  shortCode,
  idType,
  queueUrl,
  commandId = "AccountBalance",
  resultUrl,
  remarks = "Checking account balance",
  initiator = null,
}) {
  try {
    // Generate OAuth token
    const { accessToken, baseURL } = await generateOAuthToken();

    // Prepare the request with OAuth token
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Execute the Account Balance API request
    const responseBody = await req.post("/mpesa/accountbalance/v1/query", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: commandId,
      PartyA: shortCode,
      IdentifierType: idType,
      Remarks: remarks,
      QueueTimeOutURL: queueUrl,
      ResultURL: resultUrl,
    });

    return responseBody.data; // Return the response data directly
  } catch (error) {
    // Advanced error logging and categorization
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/accountbalance/v1/query",
      method: "POST",
      payload: {
        shortCode,
        idType,
        queueUrl,
        commandId,
        resultUrl,
        remarks,
        initiator,
      },
    });

    // Categorize and handle error types
    throwErrorMessages(error);
  }
}

export default balanceQueryApi;
