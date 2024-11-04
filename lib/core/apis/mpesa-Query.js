import {
  generateMpesaCredentials,
  generateOAuthToken,
} from "../utils/helpers.js";
import axios from "axios";
/**
 * Lipa Na M-Pesa Query Request - Use this API to check the status of a Lipa Na M-Pesa Online Payment.
 * @name mpesaQueryApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/MpesaExpressQuery |Lipa Na M-Pesa Query Request}
 * @param {Object} options - Options for the Lipa Na M-Pesa query request.
 * @param {string} options.checkoutRequestId - Checkout RequestID obtained from the Lipa Na M-Pesa transaction initiation.
 * @param {number} [options.shortCode] - Business Short Code used for the payment (defaults to configured shortcode).
 * @returns {Promise} - Returns a promise that resolves to the transaction status response.
 */
async function mpesaQueryApi({
  checkoutRequestId,
  shortCode,
}) {
  const {accessToken, baseURL} = await generateOAuthToken();
  // Generate credentials
  const { password, timeStamp } = generateMpesaCredentials(shortCode,);
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
    console.error("Lipa Na M-Pesa Query failed:", error.message);
    throw new Error(
      "Unable to query the Lipa Na M-Pesa transaction. Please try again later.",
    );
  }
}
export default mpesaQueryApi;
