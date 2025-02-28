import axios from "axios";
import {
  callbackTrigger,
  encryptSecurityCredential,
  generateOAuthToken,
  handleCallbacks,
  logErrorDetails,
  throwErrorMessages,
} from "../utils/helpers.js";
import { IdentifierTypes } from "../utils/constants.js";

// Globals
let callbackHandlerInitialized = false;
let conditionalCallbackData = {};

/**
 * @name transactionStatus
 * @description Enables one to Check the status of an M-pesa transaction, using a unique identifier.
 * @summary Check the status of a transaction.
 * @see {@link https://developer.safaricom.co.ke/APIs/TransactionStatus open external link}
 * @param {Object} options Options for the transaction status API.
 * @param {string} options.transactionId Unique identifier to identify a transaction on M-pesa
 * @param {string} options.initiator The name of the initiator initiating the request.
 * @param {number} options.partyA Organization/MSISDN receiving the transaction.
 * @param {number} options.identifierType Type of organization receiving the transaction.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {string} options.occasion Information to be associated with the transaction.
 * @param {string} options.OriginatorConversationID This is a globally unique identifier for the transaction request returned by the API proxy upon successful submission.
 * @param {string} options.QueueTimeOutURL URL for storing information about timeout transactions.
 * @param {string} options.resultURL The path that stores information of a transaction.
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @returns {Promise<Object>} transactionStatusResponse and (optional) conditionalCallbackData.
 */
async function transactionStatus({
  transactionId,
  partyA,
  identifierType,
  QueueTimeOutURL,
  OriginatorConversationID,
  remarks,
  occasion,
  resultURL,
  initiator,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default balance query callback handler ('handleTransactStatusCallbacks') was not called. Ignore if handling manually.\x1b[0m",
    );
  }
  /**
   * @param {number} validIdentifierTypes - Expected identifiers include const IdentifierTypes = { MSISDN: 1, TILL_NUMBER: 2, ORG_SHORTCODE: 4 };
   */
  const validIdentifierTypes = Object.values(IdentifierTypes);
  if (!validIdentifierTypes.includes(identifierType)) {
    throw new Error(
      `Invalid identifierType provided. Must be one of: ${validIdentifierTypes.join(", ")}`,
    );
  }
  try {
    const { accessToken, baseURL } = await generateOAuthToken();
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    // Default configurations
    const config = {
      commandId: "TransactionStatusQuery",
    };
    const responseBody = await req.post("/mpesa/transactionstatus/v1/query", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: config.commandId,
      TransactionID: transactionId,
      PartyA: partyA,
      OriginatorConversationID,
      IdentifierType: identifierType,
      ResultURL: resultURL,
      QueueTimeOutURL: QueueTimeOutURL,
      Remarks: remarks,
      Occasion: occasion,
    });
    conditionalCallbackData = await callbackTrigger(callbackHandlerInitialized);
    return { transactStatusResponse: responseBody.data, conditionalCallbackData };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for transactionStatus has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/transactionstatus/v1/query",
          method: "POST",
          payload: {
            transactionId,
            partyA,
            identifierType,
            QueueTimeOutURL,
            resultURL,
            initiator,
            remarks,
            occasion
          },
        },
        "Transaction status error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}

const handleTransactStatusCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "transactionStatus");
};

export { transactionStatus, handleTransactStatusCallbacks };
