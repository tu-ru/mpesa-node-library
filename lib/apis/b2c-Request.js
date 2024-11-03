import axios from "axios";
import { CommandIDs } from "./utils/constants.js";
import {
  encryptSecurityCredential,
  generateOAuthToken,
  originatorID,
} from "./utils/helpers.js";

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
 * @param {String} consumerKey - The consumer key for OAuth authentication.
 * @param {String} consumerSecret - The consumer secret for OAuth authentication.
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
  baseURL,
  certPath,
  securityCredential,
  consumerKey,
  consumerSecret,
}) {
  // Validate commandId
  const validCommandIds = Object.values(CommandIDs);
  if (!validCommandIds.includes(commandId)) {
    throw new Error(
      `Invalid commandId provided. Must be one of: ${validCommandIds.join(", ")}`,
    );
  }
  const OriginatorConversationID = originatorID();
  const token = await generateOAuthToken(consumerKey, consumerSecret, baseURL);
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  try {
    const payload = await req.post("/mpesa/b2c/v3/paymentrequest", {
      OriginatorConversationID: OriginatorConversationID,
      InitiatorName: initiatorName,
      SecurityCredential: encryptSecurityCredential(
        certPath,
        securityCredential,
      ),
      CommandID: commandId,
      Amount: amount,
      PartyA: senderParty,
      PartyB: receiverParty,
      Remarks: remarks,
      QueueTimeOutURL: queueUrl,
      ResultURL: resultUrl,
      Occasion: occasion,
    });

    return payload.data; // Return the payload data directly
  } catch (error) {
    console.error("B2C transaction failed:", error);
    throw new Error(
      "Unable to complete B2C transaction. Please try again later.",
    );
  }
}

export default b2cRequestApi;
