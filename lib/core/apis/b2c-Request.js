import axios from "axios";
import { CommandIDs } from "../utils/constants.js";
import {
  encryptSecurityCredential,
  generateOAuthToken,
  originatorID,
  throwErrorMessages,
} from "../utils/helpers.js";
/**
 * Logs detailed error information to assist in debugging.
 * @param {Error} error - The error object thrown by the API request.
 * @param {Object} context - Additional context about the request, such as endpoint and payload.
 */
function logErrorDetails(error, context) {
  console.error("B2C transaction error details:", {
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
 * B2C Payment Request
 * @name b2cRequestApi
 * @function
 * @description B2C Request - Use this API to transact between an M-Pesa shortcode and a phone number registered on M-Pesa.
 * @summary B2C payments involve a business sending money to an individual. This is a direct transaction from a business shortcode to a consumer's mobile number (MSISDN).
 * @see {@link https://developer.safaricom.co.ke/APIs/BusinessToCustomer Payment Request}
 * @param {Object} options - Options for the B2C payment request.
 * @param {number} options.senderParty - The organization (shortcode) sending the transaction.
 * @param {number} options.receiverParty - The MSISDN receiving the transaction.
 * @param {number} options.amount - The amount being transacted.
 * @param {string} options.queueUrl - URL for timeout notification on transaction failure.
 * @param {string} options.resultUrl - URL to receive transaction results from M-Pesa.
 * @param {string} [options.commandId=CommandIDs.BUSINESS_PAYMENT] - Unique command for each transaction type.
 * @param {string} [options.initiatorName=null] - The name of the initiator initiating the request (default: configured initiator).
 * @param {string} [options.remarks='B2C Payment'] - Remarks to include with the transaction.
 * @param {string} [options.occasion='Any event'] - Occasion for the payment (optional).
 * @return {Promise} - Returns a promise that resolves to the transaction result.
 */
async function b2cRequestApi({
  senderParty,
  receiverParty,
  amount,
  queueUrl,
  resultUrl,
  commandId,
  initiatorName,
  remarks = "OK!",
  occasion = "TESTING API!",
}) {
  // Validate commandId
  const validCommandIds = Object.values(CommandIDs);
  if (!validCommandIds.includes(commandId)) {
    throw new Error(
      `Invalid commandId provided. Must be one of: ${validCommandIds.join(", ")}`,
    );
  }

  const OriginatorConversationID = originatorID();
  const { accessToken, baseURL } = await generateOAuthToken();
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  try {
    const responseBody = await req.post("/mpesa/b2c/v3/paymentrequest", {
      OriginatorConversationID: OriginatorConversationID,
      InitiatorName: initiatorName,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: commandId,
      Amount: amount,
      PartyA: senderParty,
      PartyB: receiverParty,
      Remarks: remarks,
      QueueTimeOutURL: queueUrl,
      ResultURL: resultUrl,
      Occasion: occasion,
    });

    return responseBody.data; // Return the payload data directly
  } catch (error) {
    // Log detailed error information
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/b2c/v3/paymentrequest",
      method: "POST",
      payload: {
        senderParty,
        receiverParty,
        amount,
        queueUrl,
        resultUrl,
        commandId,
        initiatorName,
        remarks,
        occasion,
      },
    });

    // Categorize and throw user-friendly error messages
    throwErrorMessages(error);
  }
}

export default b2cRequestApi;
