import axios from "axios";
import {
  generateOAuthToken,
  encryptSecurityCredential,
  throwErrorMessages,
  logErrorDetails,
  callbackTrigger,
  handleCallbacks,
  validateUrl,
} from "../utils/helpers.js";

// Globals
let callbackHandlerInitialized = false;
let conditionalCallbackData = {};

/**
 *@name b2cTopUp
 *@description This API enables you to load funds to a B2C shortcode directly for disbursement. The transaction moves money from your MMF/Working account to the recipient’s utility account.
 *@summary Transfers funds from your MMF/Working account to the recipient's utility account for disbursement to a B2C shortcode.
 * @see {@link https://developer.safaricom.co.ke/APIs/B2CAccountTopUp open external link}
 * @param {Object} options B2C account top-up request options.
 * @param {string} options.initiator The M-Pesa API operator username, who needs Org Business Pay to Bulk API initiator role.
 * @param {number} options.amount The transaction amount.
 * @param {number} options.partyA Your shortcode. The shortcode from which money will be deducted.
 * @param {number} options.partyB The shortcode to which money will be moved
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {number} options.accountReference Identifier for the transaction.
 * @param {number} [options.requester] Optional. The consumer’s mobile number on behalf of whom you are paying.
 * @param {string} options.QueueTimeOutURL A URL that will be used to notify your system in case the request times out.
 * @param {string} options.resultURL A URL that will be used to send transaction results after processing.
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @return {Promise<object>} b2cTopUpResponse and (optional) conditionalCallbackData. */
async function b2cTopUp({
  initiator,
  amount,
  partyA,
  partyB,
  accountReference,
  requester,
  QueueTimeOutURL,
  resultURL,
  remarks,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default callback handler ('handleB2cTopUpCallbacks') was not called. Ignore if handling manually.\x1b[0m",
    );
  }
  try {
    validateUrl(resultURL, "resultURL");
    validateUrl(QueueTimeOutURL, "QueueTimeOutUrl");
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
      commandId: "BusinessPayToBulk",
      senderIdentifierType: "4",
      receiverIdentifierType: "4",
    };

    const responseBody = await req.post("mpesa/b2b/v1/paymentrequest", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: config.commandId,
      SenderIdentifierType: config.senderIdentifierType,
      RecieverIdentifierType: config.receiverIdentifierType,
      Amount: amount,
      PartyA: partyA,
      PartyB: partyB,
      AccountReference: accountReference,
      Requester: requester,
      Remarks: remarks,
      QueueTimeOutURL: QueueTimeOutURL,
      ResultURL: resultURL,
    });

    conditionalCallbackData = await callbackTrigger(callbackHandlerInitialized);

    return { b2cTopUpResponse: responseBody.data, conditionalCallbackData };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for b2cTopUp has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/b2b/v1/paymentrequest",
          method: "POST",
          payload: {
            initiator,
            amount,
            partyA,
            partyB,
            accountReference,
            requester,
            QueueTimeOutURL,
            resultURL,
            remarks,
          },
        },
        "B2C account top-up error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}

const handleB2cTopUpCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "b2cTopUp");
};
export { b2cTopUp, handleB2cTopUpCallbacks };
