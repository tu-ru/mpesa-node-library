import axios from "axios";
import {
  encryptSecurityCredential,
  generateOAuthToken,
} from "../utils/helpers.js";

/**
 * businessPaybillApi - Use this API to pay bills directly from your business account to a pay bill number or store.
 * Simultaneously generates an OAuth token using the consumer key and secret.
 * @name businessPaybillApi
 * @function
 * @param {Object} options - Options for the business pay bill.
 * @param {string} options.initiator - The M-Pesa API operator username (initiator).
 * @param {string} options.securityCredential - The encrypted password of the M-Pesa API operator.
 * @param {string} [options.commandId='businessPaybillApi'] - Command ID for the pay bill.
 * @param {string} [options.senderIdentifierType=4] - Type of identifier for the sender (4 for short code).
 * @param {string} [options.receiverIdentifierType=4] - Type of identifier for the receiver (4 for short code).
 * @param {number} options.amount - The transaction amount.
 * @param {number} options.partyA - The shortcode from which money will be deducted.
 * @param {number} options.partyB - The shortcode to which money will be sent.
 * @param {number} options.accountReference - Account reference number for payment.
 * @param {number} options.requester - Optional. The consumer’s mobile number on behalf of whom you are paying
 * @param {string} [options.remarks='OK'] - Additional remarks for the transaction.
 * @param {string} options.queueTimeOutURL - URL for timeout notification on transaction failure.
 * @param {string} options.resultURL - URL for notification of the transaction result.
 * @param {string} consumerKey - The consumer key for OAuth authentication.
 * @param {string} consumerSecret - The consumer secret for OAuth authentication.
 * @param {string} baseURL - Specifies whether you are in sandbox mode or production mode.
 * @param {string} certPath - Specifies the path to either your sandbox or production certificate.
 * @return {Promise<Object>} - Returns a promise that resolves to the transaction result or status.
 */

async function businessPaybillApi({
  initiator,
  securityCredential,
  commandId = "BusinessPayBill",
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
  consumerKey,
  consumerSecret,
  baseURL,
  certPath,
}) {
  const token = await generateOAuthToken(consumerKey, consumerSecret, baseURL);
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  try {
    const responseBody = await req.post("/mpesa/b2b/v1/paymentrequest", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(
        certPath,
        securityCredential,
      ),
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
    return responseBody.data; // Return the response data directly
  } catch (error) {
    console.error("Failed to execute business pay bill:", error);
    throw new Error(
      "Unable to complete pay bill request. Please try again later.",
    );
  }
}

export default businessPaybillApi;
