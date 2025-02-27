import axios from "axios";
import {
  callbackTrigger,
  generateOAuthToken,
  handleCallbacks,
  logErrorDetails,
  throwErrorMessages,
  validateUrl,
} from "../utils/helpers.js";
import { responseTypes } from "../utils/constants.js";

// Globals
let callbackHandlerInitialized = false;
let conditionalCallbackData = {};

/**
 * @name C2BRegister
 * @description Register URL API works hand in hand with Customer to Business (C2B) APIs and allows receiving payment notifications to your paybill. This API enables you to register the callback URLs via which you shall receive notifications for payments to your pay bill/till numbers
 * @summary Registers callback validation and confirmation URLs on M-Pesa to receive payment notifications for your paybill/till numbers.
 * @see {@link https://developer.safaricom.co.ke/APIs/CustomerToBusinessRegisterURL open external link}
 * @param {Object} options Options for the C2B Register URL.
 * @param {string} options.confirmationUrl URL to receive confirmation upon payment completion.
 * @param {string} options.validationUrl URL to receive validation upon payment submission (default: external validation disabled).
 * @param {number} options.shortCode Unique M-PESA pay bill/till number.
 * @param {string} options.responseType Action if validation URL is unreachable (values: Completed or Cancelled).
 * @param {boolean} [options.proErrorLogging] Logs out detailed errors for debugging purposes
 * @return {Promise<Object>} c2bRegisterResponse and (optional) conditionalCallbackData.
 */
async function c2bRegister({
  confirmationUrl,
  validationUrl,
  shortCode,
  responseType,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default balance query callback handler ('handleC2bRegisterCallbacks') was not called. Ignore if handling manually.\x1b[0m",
    );
  }
  /**
   * @param {string} validResponseTypes - Should either be Completed or Cancelled
   */
  const validResponseTypes = Object.values(responseTypes);
  if (!validResponseTypes.includes(responseType)) {
    throw new Error(
      `Invalid responseType provided. Must be one of: ${validResponseTypes.join(", ")}`,
    );
  }
  try {
    validateUrl(confirmationUrl, "confirmationUrl");
    validateUrl(validationUrl, "validationUrl");
    const { accessToken, baseURL } = await generateOAuthToken();
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const responseBody = await req.post("/mpesa/c2b/v1/registerurl", {
      ShortCode: shortCode,
      ResponseType: responseType,
      ConfirmationURL: confirmationUrl,
      ValidationURL: validationUrl,
    });
    conditionalCallbackData = await callbackTrigger(callbackHandlerInitialized);
    return { c2bRegisterResponse: responseBody.data, conditionalCallbackData };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for c2bRegister has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/c2b/v1/registerurl",
          method: "POST",
          payload: {
            confirmationUrl,
            validationUrl,
            shortCode,
            responseType,
          },
        },
        "C2B Register transaction error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}

const handleC2bRegisterCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "c2bRegister");
};

export { c2bRegister, handleC2bRegisterCallbacks };
