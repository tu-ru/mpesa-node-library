import axios from "axios";
import {
  generateOAuthToken,
  encryptSecurityCredential,
} from "../utils/helpers.js";

/**
 * B2B Account Top-Up - Use this API to load funds to a B2B shortcode for disbursement.
 * @name b2bTopUpApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/b2b/apis/post/paymentrequest|B2B Account Top-Up}
 * @param {Object} options - Options for the B2B account top-up request.
 * @param {string} options.initiator - The M-Pesa API operator username with the B2B API initiator role..
 * @param {string} [options.commandId='businessPaybillApi'] - Transaction command ID (e.g., 'businessPaybillApi').
 * @param {string} options.senderIdentifierType - Identifier type of the shortcode from which funds are deducted. This API supports type "4" only.
 * @param {string} options.receiverIdentifierType - Identifier type of the shortcode to which funds are credited. This API supports type "4" only.
 * @param {number} options.amount - The transaction amount to be moved.
 * @param {number} options.partyA - Shortcode from which the funds will be deducted.
 * @param {number} options.partyB - Shortcode to which the funds will be transferred.
 * @param {number} options.accountReference - Account reference, usually an identifier for the transaction.
 * @param {string} options.remarks - Any additional information to be associated with the transaction.
 * @param {number} options.requester - Optional. The consumer’s mobile number on behalf of whom you are paying.
 * @param {string} options.queueTimeOutURL - URL to notify in case the request times out before processing.
 * @param {string} options.resultURL - URL to send transaction results after processing.
 * @returns {Promise} - Returns a promise that resolves to the B2B transaction response.
 */

async function b2bTopUpApi({
  initiator,
  commandId = "BusinessPayToBulk",
  senderIdentifierType = "4",
  receiverIdentifierType = "4",
  amount,
  partyA,
  partyB,
  accountReference,
  requester,
  remarks = "OK!",
  queueTimeOutURL,
  resultURL,
}) {
  const { accessToken, baseURL } = await generateOAuthToken();
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  try {
    const response = await req.post("mpesa/b2b/v1/paymentrequest", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: commandId,
      SenderIdentifierType: senderIdentifierType,
      RecieverIdentifierType: receiverIdentifierType,
      Amount: amount,
      PartyA: partyA,
      PartyB: partyB,
      AccountReference: accountReference,
      Requester: requester,
      Remarks: remarks,
      QueueTimeOutURL: queueTimeOutURL,
      ResultURL: resultURL,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to top up account:", error);
    throw new Error("Unable to top up account. Please try again later.");
  }
}
export default b2bTopUpApi;
