import axios from "axios";
import {
  callbackTrigger,
  encryptSecurityCredential,
  generateOAuthToken,
  handleCallbacks,
  logErrorDetails,
  throwErrorMessages,
  validateUrl,
} from "../utils/helpers.js";

// Globals
let callbackHandlerInitialized = false;
let conditionalCallbackData = {};

/**
 * @name reversals
 * @description Reverses a C2B M-Pesa transaction. Once a customer pays and there is a need to reverse the transaction, the organization will use this API to reverse the amount.
 * @summary Reverses an M-pesa transaction
 * @see {@link https://developer.safaricom.co.ke/APIs/Reversal open external link}
 * @param {Object} options Options for the reversal API.
 * @param {string} options.transactionId Transaction ID for reversal (e.g., LKXXXX1234).
 * @param {number} options.amount Amount to be reversed.
 * @param {string} options.QueueTimeOutURL URL for timeout transaction details.
 * @param {string} options.resultURL URL for transaction details.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {string} options.occasion Information to be associated with the transaction.
 * @param {number} options.receiverParty Organization receiving the transaction.
 * @param {string} options.initiator Name of the initiator of the request.
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @returns {Promise<Object>} reversalsResponse and (optional) conditionalCallbackData.
 */
async function reversals({
  transactionId,
  amount,
  QueueTimeOutURL,
  resultURL,
  receiverParty,
  initiator,
  remarks,
  occasion,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default callback handler ('handleReversalCallbacks') was not called. Ignore if handling manually.\x1b[0m",
    );
  }
  try {
    validateUrl(resultURL, "resultURL");
    validateUrl(QueueTimeOutURL, "timeoutUrl");
    const { accessToken, baseURL } = await generateOAuthToken();
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    // default configurations
    const config = {
      receiverIdType: "11",
      commandId: "TransactionReversal",
    };
    const responseBody = await req.post("/mpesa/reversal/v1/request", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: config.commandId,
      TransactionID: transactionId,
      Amount: amount,
      ReceiverParty: receiverParty,
      RecieverIdentifierType: config.receiverIdType,
      ResultURL: resultURL,
      QueueTimeOutURL: QueueTimeOutURL,
      Remarks: remarks,
      Occasion: occasion,
    });

    conditionalCallbackData = await callbackTrigger(callbackHandlerInitialized);

    return { reversalsResponse: responseBody.data, conditionalCallbackData };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for reversals has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/reversal/v1/request",
          method: "POST",
          payload: {
            transactionId,
            amount,
            QueueTimeOutURL,
            resultURL,
            receiverParty,
            initiator,
            remarks,
            occasion,
          },
        },
        "Transaction reversal error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}
const handleReversalCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "reversals");
};

export { reversals, handleReversalCallbacks };
