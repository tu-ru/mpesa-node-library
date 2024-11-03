import {
  encryptSecurityCredential,
  generateOAuthToken,
} from "./utils/helpers.js";
import axios from "axios";
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
 * @param {String} consumerKey - The consumer key for OAuth authentication.
 * @param {String} consumerSecret - The consumer secret for OAuth authentication.
 * @param {String} baseURL - Specifies whether you are in sandbox mode or production mode.
 * @param {String} certPath - Specifies the path to either your sandbox or production certificate.
 * @param {String} securityCredential -  The security credential for encryption.
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
  baseURL,
  certPath,
  securityCredential,
  consumerKey,
  consumerSecret,
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
    const responseBody = await req.post("/mpesa/transactionstatus/v1/query", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(
        certPath,
        securityCredential,
      ),
      CommandID: commandId,
      TransactionID: transactionId,
      OriginatorConversationID: OriginatorConversationID,
      PartyA: receiverParty,
      IdentifierType: idType,
      ResultURL: resultUrl,
      QueueTimeOutURL: queueUrl,
      Remarks: remarks,
      Occasion: occasion,
    });
    return responseBody.data;
  } catch (error) {
    console.error("Failed to fetch transaction status:", error);
    throw new Error(
      "Unable to retrieve transaction status. Please try again later.",
    );
  }
}

export default transactionStatusApi;
