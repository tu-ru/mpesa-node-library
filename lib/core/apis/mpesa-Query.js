import {
  generateMpesaCredentials,
  generateOAuthToken,
  logErrorDetails,
  throwErrorMessages,
} from "../utils/helpers.js";
import axios from "axios";

/**
 * @name mpesaQuery
 * @description Use this API to check the status of a Lipa Na M-Pesa Online Payment.
 * @summary Check transaction status of a Lipa na M-Pesa payment.
 * @see {@link https://developer.safaricom.co.ke/APIs/MpesaExpressQuery open external link}
 * @param {Object} options Options for the Lipa Na M-Pesa query API.
 * @param {string} options.checkoutRequestId Unique identifier for the processed checkout transaction.
 * @param {number} options.businessShortCode Organization's shortcode (Paybill or Buygoods, 5-7 digits).
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @returns {Promise<Object>} mpesaQueryResponse.
 */
async function mpesaQuery({
  checkoutRequestId,
  businessShortCode,
  proErrorLogging = false,
}) {
  const { accessToken, baseURL } = await generateOAuthToken();
  const { password, timeStamp } = generateMpesaCredentials(businessShortCode);
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  try {
    const responseBody = await req.post("/mpesa/stkpushquery/v1/query", {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timeStamp,
      CheckoutRequestID: checkoutRequestId,
    });

    return { mpesaQueryResponse: responseBody.data };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for mpesaQuery has been initialized",
      );
      logErrorDetails(
        error,
        {
          apiEndpoint: "/mpesa/stkpushquery/v1/query",
          method: "POST",
          payload: {
            businessShortCode,
            checkoutRequestId,
          },
        },
        "Mpesa Query transaction error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}

export { mpesaQuery };
