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
 * @name businessPaybill
 * @description This API enables you to pay bills directly from your business account to a pay bill number, or a paybill store. You can use this API to pay on behalf of a consumer/requester. The transaction moves money from your MMF/Working account to the recipient’s utility account.
 * @summary  Facilitates bill payments from a business account to a paybill number, transferring funds to the recipient’s utility account.
 * @see {@link https://developer.safaricom.co.ke/APIs/BusinessPayBill open external link}
 * @param {Object} options Options for the business pay bill.
 * @param {string} options.initiator M-Pesa API operator username with Org Business Pay Bill API role.
 * @param {number} options.amount Transaction amount.
 * @param {number} options.partyA Shortcode from which money will be deducted.
 * @param {number} options.partyB Shortcode to which money will be moved.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {number} options.accountReference Account number for the payment (up to 13 characters).
 * @param {number} [options.requester] Optional consumer’s mobile number (if paying on their behalf).
 * @param {string} options.QueueTimeOutURL URL for timeout notifications.
 * @param {string} options.resultURL URL for sending transaction results after processing.
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @return {Promise<Object>} businessPaybillResponse and (optional) conditionalCallbackData.
 */
async function businessPaybill({
  initiator,
  amount,
  partyA,
  partyB,
  remarks,
  accountReference,
  requester,
  QueueTimeOutURL,
  resultURL,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default callback handler ('handleBusinessPaybillCallbacks') was not called. Ignore if handling manually.\x1b[0m",
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
    // Default configurations
    const config = {
      commandId: "BusinessPayBill",
      senderIdentifierType: "4",
      receiverIdentifierType: "4",
    };
    const responseBody = await req.post("/mpesa/b2b/v1/paymentrequest", {
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

    return {
      businessPaybillResponse: responseBody.data,
      conditionalCallbackData,
    };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for businessPaybill has been initialized",
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
            remarks
          },
        },
        "Business Pay Bill transaction error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}

const handleBusinessPaybillCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "businessPaybill");
};

export { businessPaybill, handleBusinessPaybillCallbacks };
