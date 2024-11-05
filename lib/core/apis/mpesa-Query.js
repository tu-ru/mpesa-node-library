import {
  generateMpesaCredentials,
  generateOAuthToken,
  throwErrorMessages,
} from "../utils/helpers.js";
import axios from "axios";

/**
 * Logs detailed error information for easier debugging.
 * @param {Error} error - The error object thrown by the API request.
 * @param {Object} context - Additional context about the request, such as endpoint and payload.
 */
function logErrorDetails(error, context) {
  console.error("Mpesa Query transaction error details:", {
    message: error.message,
    stack: error.stack,
    ...(error.response && {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    }),
    ...(error.request && { request: error.request }),
    context,
  });
}

/**
 * Lipa Na M-Pesa Query Request - Use this API to check the status of a Lipa Na M-Pesa Online Payment.
 * @name mpesaQueryApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/MpesaExpressQuery | Lipa Na M-Pesa Query Request}
 * @param {Object} options - Options for the Lipa Na M-Pesa query request.
 * @param {string} options.checkoutRequestId - Checkout RequestID obtained from the Lipa Na M-Pesa transaction initiation.
 * @param {number} [options.shortCode] - Business Short Code used for the payment (defaults to configured shortcode).
 * @returns {Promise<Object>} - Returns a promise that resolves to the transaction status response.
 */
async function mpesaQueryApi({ checkoutRequestId, shortCode }) {
  const { accessToken, baseURL } = await generateOAuthToken();
  const { password, timeStamp } = generateMpesaCredentials(shortCode);

  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await req.post("/mpesa/stkpushquery/v1/query", {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timeStamp,
      CheckoutRequestID: checkoutRequestId,
    });

    return response.data;
  } catch (error) {
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/stkpushquery/v1/query",
      method: "POST",
      payload: {
        shortCode,
        checkoutRequestId,
      },
    });

    // Categorize error messages based on the response
    throwErrorMessages(error);
  }
}

export default mpesaQueryApi;
