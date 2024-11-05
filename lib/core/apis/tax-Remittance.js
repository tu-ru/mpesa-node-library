import axios from "axios";
import {
  generateOAuthToken,
  encryptSecurityCredential,
  throwErrorMessages,
} from "../utils/helpers.js";

/**
 * Logs error details for advanced debugging.
 * @param {Error} error - The error object caught in the catch block.
 * @param {Object} context - Additional context about the API request, such as endpoint, method, and payload.
 */
function logErrorDetails(error, context) {
  console.error("Tax remittance error details:", {
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
 * Tax Remittance API - Use this API to remit tax to the Kenya Revenue Authority (KRA).
 * @name taxRemittanceApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/TaxRemittance | KRA Tax Remittance}
 * @param {Object} options - Options for the tax remittance request.
 * @param {string} options.initiator - The M-Pesa API operator username with the tax remittance API initiator role.
 * @param {string} [options.commandId='PayTaxToKRA'] - Transaction command ID.
 * @param {string} options.senderIdentifierType - Identifier type of the shortcode from which funds are deducted. Only "4" is supported.
 * @param {string} options.receiverIdentifierType - Identifier type of the shortcode to which funds are credited. Only "4" is supported.
 * @param {number} options.amount - The transaction amount to be remitted.
 * @param {number} options.partyA - Shortcode from which the funds will be deducted.
 * @param {number} options.partyB - Shortcode to which the funds will be transferred (e.g., 572572 for KRA).
 * @param {number} options.accountReference - Payment registration number (PRN) issued by KRA.
 * @param {string} options.remarks - Additional information to be associated with the transaction.
 * @param {string} options.queueTimeOutURL - URL to notify in case of a request timeout before processing.
 * @param {string} options.resultURL - URL to send transaction results after processing.
 * @returns {Promise} - Returns a promise that resolves to the tax remittance transaction response.
 */
async function taxRemittanceApi({
  initiator,
  commandId = "PayTaxToKRA",
  senderIdentifierType = "4",
  receiverIdentifierType = "4",
  amount,
  partyA,
  partyB,
  accountReference,
  remarks = "OK",
  queueTimeOutURL,
  resultURL,
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

    // Send tax remittance request
    const response = await req.post("/mpesa/b2b/v1/remittax", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: commandId,
      SenderIdentifierType: senderIdentifierType,
      RecieverIdentifierType: receiverIdentifierType,
      Amount: amount,
      PartyA: partyA,
      PartyB: partyB,
      AccountReference: accountReference,
      Remarks: remarks,
      QueueTimeOutURL: queueTimeOutURL,
      ResultURL: resultURL,
    });

    return response.data; // Return the response data directly
  } catch (error) {
    // Advanced error logging
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/b2b/v1/remittax",
      method: "POST",
      payload: {
        initiator,
        commandId,
        senderIdentifierType,
        receiverIdentifierType,
        amount,
        partyA,
        partyB,
        accountReference,
        remarks,
        queueTimeOutURL,
        resultURL,
      },
    });

    // Categorize and handle error types
    throwErrorMessages(error);
  }
}

export default taxRemittanceApi;
