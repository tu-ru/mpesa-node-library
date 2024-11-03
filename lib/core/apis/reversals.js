import axios from "axios";
import {
  encryptSecurityCredential,
  generateOAuthToken,
} from "../utils/helpers.js";
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
 * @param {string} options.consumerKey - The consumer key for OAuth authentication.
 * @param {string} options.consumerSecret - The consumer secret for OAuth authentication.
 * @param {String} baseURL - Specifies whether you are in sandbox mode or production mode.
 * @param {String} certPath - Specifies the path to either your sandbox or production certificate.
 * @param {String} securityCredential -  The security credential for encryption.
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
  baseURL,
  certPath,
  securityCredential,
  consumerKey,
  consumerSecret,
}) {
  // Generate OAuth token
  const token = await generateOAuthToken(consumerKey, consumerSecret, baseURL);

  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await req.post("/mpesa/reversal/v1/request", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(
        certPath,
        securityCredential,
      ),
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
    console.error("Reversal request failed:", error.message);
    throw new Error(
      "Unable to process the reversal request. Please try again later.",
    );
  }
}

export default reversalsApi;
