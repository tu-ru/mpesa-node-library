import axios from "axios";
import {
  encryptSecurityCredential,
  generateOAuthToken,
} from "./utils/helpers.js";
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
 * @param {String} consumerKey - The consumer key for OAuth authentication.
 * @param {String} consumerSecret - The consumer secret for OAuth authentication.
 * @param {String} baseURL - Specifies whether you are in sandbox mode or production mode.
 * @param {String} certPath - Specifies the path to either your sandbox or production certificate.
 * @param {String} securityCredential -  The security credential for encryption.
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
  baseURL,
  certPath,
  securityCredential,
  consumerKey,
  consumerSecret,
}) {
  // Generate OAuth token
  const token = await generateOAuthToken(consumerKey, consumerSecret, baseURL);
  // Prepare the request with OAuth token
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  // Execute the Account Balance API request
  try {
    const responseBody = await req.post("/mpesa/accountbalance/v1/query", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(
        certPath,
        securityCredential,
      ),
      CommandID: commandId,
      PartyA: shortCode,
      IdentifierType: idType,
      Remarks: remarks,
      QueueTimeOutURL: queueUrl,
      ResultURL: resultUrl,
    });
    return responseBody.data; // Return the response data directly
  } catch (error) {
    console.error("Failed to fetch account balance:", error);
    throw new Error(
      "Unable to retrieve account balance. Please try again later.",
    );
  }
}

export default balanceQueryApi;
