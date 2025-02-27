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
import { IdentifierTypes } from "../utils/constants.js";

// Globals
let callbackHandlerInitialized = false;
let conditionalCallbackData = {};

/**
 * @name balanceQuery
 * @description The Account Balance API is used to request the account balance of a short code. This can be used for both B2C, buy goods and pay bill accounts.
 * @summary Retrieves the balance of a short code associated with the developer account, supporting B2C, buy goods, and pay bill accounts.
 * @see {@link https://developer.safaricom.co.ke/APIs/AccountBalance open external link}
 * @param {Object} options Options for the balance query API.
 * @param {number} options.partyA The shortcode of the querying organization.
 * @param {number} options.identifierType Type of the querying organization.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {String} options.QueueTimeOutURL URL to receive timeout messages.
 * @param {String} options.resultUrl URL to receive the result message.
 * @param {String} options.initiator The credential/username for authentication.
 * @param {boolean} [options.proErrorLogging=false] Logs out advanced error details - good for debugging
 * @return {Promise<object>} balanceQueryResponse and (optional) conditionalCallbackData.
 */
async function balanceQuery({
  partyA,
  identifierType,
  QueueTimeOutURL,
  resultUrl,
  initiator,
  remarks,
  proErrorLogging = false,
}) {
  if (!callbackHandlerInitialized) {
    console.info(
      "\x1b[42m\x1b[30m\x1b[1m The default balance query callback handler ('handleBalanceQueryCallbacks') was not called. Ignore if handling manually.\x1b[0m"
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
      commandId: "AccountBalance",
      remarks: "OK",
    };

    const responseBody = await req.post("/mpesa/accountbalance/v1/query", {
      Initiator: initiator,
      SecurityCredential: encryptSecurityCredential(),
      CommandID: config.commandId,
      PartyA: partyA,
      IdentifierType: identifierType,
      Remarks: remarks,
      QueueTimeOutURL: QueueTimeOutURL,
      ResultURL: resultUrl,
    });

    conditionalCallbackData = await callbackTrigger(callbackHandlerInitialized);

    return { balanceQueryResponse: responseBody.data, conditionalCallbackData };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for balanceQuery has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/accountbalance/v1/query",
          method: "POST",
          payload: { partyA, identifierType, QueueTimeOutURL, resultUrl, initiator, remarks },
        },
        "Balance query error details:",
      );
    }
    throw await throwErrorMessages(error);
  }
}

const handleBalanceQueryCallbacks = async (app) => {
  callbackHandlerInitialized = true;
  await handleCallbacks(app, "balanceQuery");
};

export { balanceQuery, handleBalanceQueryCallbacks };
