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
  console.error("Transaction reversal error details:", {
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
 * Reversal Request - Use this API to reverse an M-Pesa transaction C2B.
 * @name reversalsApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/Reversal Request}
 * @param {Object} options - Options for the reversal request.
 * @param {string} options.transactionId - The transaction ID for reversal, e.g., LKXXXX1234.
 * @param {number} options.amount - The amount to be reversed.
 * @param {string} options.queueUrl - The URL that stores information about timeout transactions.
 * @param {string} options.resultUrl - The URL that stores information about the transaction result.
 * @param {number} [options.shortCode=null] - The shortcode of the organization receiving the transaction.
 * @param {string} [options.remarks='Reversal'] - Comments that are sent along with the transaction.
 * @param {string} [options.occasion='Reversal'] - Optional parameter for the occasion of the reversal.
 * @param {string} [options.initiator=null] - The name of the initiator initiating the request (defaults to configured initiator).
 * @param {string} [options.receiverIdType='11'] - Type of organization receiving the transaction.
 * @param {string} [options.commandId='TransactionReversal'] - Command ID, must be 'TransactionReversal'.
 * @returns {Promise} - A promise that resolves to the reversal response.
 */
async function reversalsApi({
  transactionId,
  amount,
  queueUrl,
  resultUrl,
  shortCode,
  remarks = "OK!",
  occasion = "TEST!",
  initiator,
  receiverIdType = "11",
  commandId = "TransactionReversal",
}) {
  try {
    // Generate OAuth token
    const { accessToken, baseURL } = await generateOAuthToken();

    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Execute the reversal request
    const response = await req.post("/mpesa/reversal/v1/request", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: commandId,
      TransactionID: transactionId,
      Amount: amount,
      ReceiverParty: shortCode,
      RecieverIdentifierType: receiverIdType,
      ResultURL: resultUrl,
      QueueTimeOutURL: queueUrl,
      Remarks: remarks,
      Occasion: occasion,
    });

    return response.data; // Return the response data directly
  } catch (error) {
    // Advanced error logging
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/reversal/v1/request",
      method: "POST",
      payload: {
        transactionId,
        amount,
        queueUrl,
        resultUrl,
        shortCode,
        remarks,
        occasion,
        initiator,
        receiverIdType,
        commandId,
      },
    });

    // Categorize and handle error types
    throwErrorMessages(error);
  }
}

export default reversalsApi;
