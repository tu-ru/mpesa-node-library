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
  console.error("Transaction status error details:", {
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
 * Transaction Status Request - Use this API to check the status of a transaction on M-Pesa.
 * @name transactionStatusApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/transaction-status/apis/post/query|Transaction Status Request}
 * @param {Object} options - Options for the transaction status request.
 * @param {string} options.transactionId - Unique identifier for the transaction on M-Pesa.
 * @param {number} options.receiverParty - Organization/MSISDN receiving the transaction.
 * @param {number} options.idType - Type of organization receiving the transaction.
 * @param {string} options.queueUrl - URL for storing information about timeout transactions.
 * @param {string} options.resultUrl - URL for storing information about the transaction result.
 * @param {string} [options.remarks='TransactionReversal'] - Comments sent along with the transaction.
 * @param {string} [options.occasion='TransactionReversal'] - Optional parameter.
 * @param {string} [options.initiator] - Name of the initiator initiating the request (defaults to configured initiator).
 * @param {string} [options.commandId='transactionStatusApiQuery'] - Command ID, which Should be 'transactionStatusApiQuery'.
 * @returns {Promise} - Returns a promise that resolves to the transaction status response.
 */
async function transactionStatusApi({
  transactionId,
  receiverParty,
  idType,
  queueUrl,
  OriginatorConversationID,
  resultUrl,
  remarks = "OK!",
  occasion = "TEST!",
  initiator,
  commandId = "TransactionStatusQuery",
}) {
  try {
    // Generate OAuth token
    const { accessToken, baseURL } = await generateOAuthToken();

    // Axios request setup
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Send transaction status request
    const responseBody = await req.post("/mpesa/transactionstatus/v1/query", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: commandId,
      TransactionID: transactionId,
      OriginatorConversationID,
      PartyA: receiverParty,
      IdentifierType: idType,
      ResultURL: resultUrl,
      QueueTimeOutURL: queueUrl,
      Remarks: remarks,
      Occasion: occasion,
    });

    return responseBody.data; // Return the response data directly
  } catch (error) {
    // Advanced error logging
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/transactionstatus/v1/query",
      method: "POST",
      payload: {
        transactionId,
        receiverParty,
        idType,
        queueUrl,
        OriginatorConversationID,
        resultUrl,
        remarks,
        occasion,
        initiator,
        commandId,
      },
    });

    // Categorize and handle error types
    throwErrorMessages(error);
  }
}

export default transactionStatusApi;
