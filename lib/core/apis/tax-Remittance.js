import axios from "axios";
import {
  generateOAuthToken,
  encryptSecurityCredential,
  throwErrorMessages,
  logErrorDetails,
  callbackTrigger,
  validateUrl,
  handleCallbacks,
} from "../utils/helpers.js";

// Globals
let callbackHandlerInitialized = false;
let conditionalCallbackData = {};

/**
 * @name taxRemittance
 * @description This API enables businesses to remit tax to Kenya Revenue Authority (KRA). To use this API, prior integration is required with KRA for tax declaration, payment registration number (PRN) generation, and exchange of other tax-related information.
 * @summary Enables one to remit tax to Kenya Revenue Authority (KRA)
 * @see {@link https://developer.safaricom.co.ke/APIs/TaxRemittance open external link}
 * @param {Object} options Options for the tax remittance API.
 * @param {string} options.initiator The M-Pesa API operator username with the tax remittance API initiator role.
 * @param {number} options.amount The transaction amount.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {number} options.partyA This is your own shortcode from which the money will be deducted.
 * @param {number} options.partyB The account to which money will be credited.
 * @param {number} options.accountReference The payment registration number (PRN) issued by KRA
 * @param {string} options.QueueTimeOutURL URL to notify in case of a request timeout before processing.
 * @param {string} options.resultUrl URL to send transaction results after processing.
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @returns {Promise<Object>} remittanceResponse and (optional) conditionalCallbackData.
 */
async function taxRemittance({
  initiator,
  amount,
  partyA,
  partyB,
  accountReference,
  QueueTimeOutURL,
  remarks,
  resultUrl,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default balance query callback handler ('handleTaxRemittanceCallbacks') was not called. Ignore if handling manually.\x1b[0m",
    );
  }
  try {
    validateUrl(resultUrl, "resultUrl");
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
      commandId: "PayTaxToKRA",
      senderIdentifierType: "4",
      receiverIdentifierType: "4",
    };
    const responseBody = await req.post("/mpesa/b2b/v1/remittax", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: config.commandId,
      SenderIdentifierType: config.senderIdentifierType,
      RecieverIdentifierType: config.receiverIdentifierType,
      Amount: amount,
      PartyA: partyA,
      PartyB: partyB,
      AccountReference: accountReference,
      Remarks: remarks,
      QueueTimeOutURL: QueueTimeOutURL,
      ResultURL: resultUrl,
    });
    conditionalCallbackData = await callbackTrigger(callbackHandlerInitialized);
    return { remittanceResponse: responseBody.data, conditionalCallbackData };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for taxRemittance has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/b2b/v1/remittax",
          method: "POST",
          payload: {
            initiator,
            amount,
            partyA,
            partyB,
            accountReference,
            QueueTimeOutURL,
            resultUrl,
            remarks
          },
        },
        "Tax remittance error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}

const handleTaxRemittanceCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "taxRemittance");
};

export { taxRemittance, handleTaxRemittanceCallbacks };
