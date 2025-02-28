import axios from "axios";
import { CommandIDs } from "../utils/constants.js";
import {
  callbackTrigger,
  encryptSecurityCredential,
  generateOAuthToken,
  handleCallbacks,
  logErrorDetails,
  originatorID,
  throwErrorMessages,
  validateFormatPhone,
  validateUrl,
} from "../utils/helpers.js";

// Globals
let callbackHandlerInitialized = false;
let conditionalCallbackData = {};

/**
 * @name b2cRequest
 * @description B2C API can be used in several scenarios by businesses that require to either make Salary Payments, Cashback payments, Promotional Payments(e.g. betting winning payouts), winnings, financial institutions withdrawal of funds, loan disbursements, etc.
 * @summary B2C payments involve a business sending money to an individual. This is a direct transaction from a business shortcode to a consumer's mobile number (MSISDN).
 * @see {@link https://developer.safaricom.co.ke/APIs/BusinessToCustomer open external link}
 * @param {Object} options Options for the B2C payment request.
 * @param {number} options.partyA The B2C organization shortcode sending the money.
 * @param {string} options.partyB Customer mobile number (with country code, e.g., 254).
 * @param {number} options.amount The amount being transacted.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {string} options.occasion Information to be associated with the transaction.
 * @param {string} options.QueueTimeOutURL URL for timeout notifications.
 * @param {string} options.resultURL URL for M-PESA to send payment processing notifications.
 * @param {string} options.commandId Unique command specifying B2C transaction type (e.g., BusinessPayment).
 * @param {string} options.initiatorName API user created by Business Administrator for B2C transactions.
 * @param {boolean} [options.proErrorLogging=false] Logs out advanced error details - good for debugging.
 * @return {Promise<object>} b2cRequestResponse and (optional) conditionalCallbackData. */
async function b2cRequest({
  partyA,
  partyB,
  amount,
  QueueTimeOutURL,
  remarks,
  occasion,
  resultURL,
  commandId,
  initiatorName,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default balance query callback handler ('handleB2cRequestCallbacks') was not called. Ignore if handling manually.\x1b[0m",
    );
  }
  /**
   * @param {string} validCommandIds - loops through object values with strings "SalaryPayment", "BusinessPayment" PromotionPayment"
   */
  const validCommandIds = Object.values(CommandIDs);
  if (!validCommandIds.includes(commandId)) {
    throw new Error(
      `Invalid commandId provided. Must be one of: ${validCommandIds.join(", ")}`,
    );
  }
  const _msisdn = validateFormatPhone(partyB);
  try {
    validateUrl(resultURL, "resultURL");
    validateUrl(QueueTimeOutURL, "QueueTimeOutURL");
    const OriginatorConversationID = originatorID();
    const { accessToken, baseURL } = await generateOAuthToken();

    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const responseBody = await req.post("/mpesa/b2c/v3/paymentrequest", {
      OriginatorConversationID,
      InitiatorName: initiatorName,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: commandId,
      Amount: amount,
      PartyA: partyA,
      PartyB: _msisdn,
      Remarks: remarks,
      QueueTimeOutURL: QueueTimeOutURL,
      ResultURL: resultURL,
      Occasion: occasion,
    });

    conditionalCallbackData = await callbackTrigger(callbackHandlerInitialized);

    return { b2cRequestResponse: responseBody.data, conditionalCallbackData };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for b2cRequest has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/b2c/v3/paymentrequest",
          method: "POST",
          payload: {
            partyA,
            _msisdn,
            amount,
            QueueTimeOutURL,
            resultURL,
            commandId,
            initiatorName,
            occasion,
            remarks,
          },
        },
        "B2C transaction error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}
const handleB2cRequestCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "b2cRequest");
};
export { b2cRequest, handleB2cRequestCallbacks };
