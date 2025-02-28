import {
  generateOAuthToken,
  logErrorDetails,
  throwErrorMessages,
  validateFormatPhone,
} from "../utils/helpers.js";
import axios from "axios";

/**
 * @name c2bSimulate
 * @description This function simulates a C2B (Customer to Business) transaction by initiating a payment from an MSISDN to a business shortcode.
 * @summary Simulate a transaction from an MSISDN to a business shortcode
 * @see {@link https://developer.safaricom.co.ke/APIs/CustomerToBusinessRegisterURL open external link}
 * @param {Object} options Options for the C2B simulation.
 * @param {string} options.msisdn The MSISDN receiving the transaction
 * @param {number} options.amount Transaction amount.
 * @param {string} options.billRefNumber Bill reference number e.g. "invoice008".
 * @param {number} options.shortCode Usually, a unique number is tagged to an M-PESA pay bill/till number of the organization
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @return {Promise<Object>} c2bSimulateResponse.
 */
async function c2bSimulate({
  msisdn,
  amount,
  billRefNumber,
  shortCode,
  proErrorLogging = false,
}) {
  /** SIMULATE SHOULD ONLY BE PERFORMED IN SANDBOX MODE, NEVER IN PRODUCTION **/
  const { accessToken, baseURL } = await generateOAuthToken();
  if (baseURL === "https://api.safaricom.co.ke") {
    throw new Error(
      "Simulation is allowed only in development or sandbox environment!",
    );
  }
  try {
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const config = {
      commandId: "CustomerPayBillOnline",
    };
    const responseBody = await req.post(`/mpesa/c2b/v1/simulate`, {
      ShortCode: shortCode,
      CommandID: config.commandId,
      Amount: amount,
      Msisdn: validateFormatPhone(msisdn),
      BillRefNumber: billRefNumber,
    });
    return { c2bSimulateResponse: responseBody.data };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for c2bSimulate has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/c2b/v1/simulate",
          method: "POST",
          payload: {
            msisdn,
            amount,
            billRefNumber,
            shortCode,
          },
        },
        "C2B Simulation transaction error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}
export { c2bSimulate };
