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
 * @param {string} [options.passKey] - Lipa Na M-Pesa Pass Key for authentication (defaults to configured passkey).
 * @param {string} options.consumerKey - The consumer key for OAuth token generation.
 * @param {string} options.consumerSecret - The consumer secret for OAuth token generation.
 * @param {String} baseURL - Specifies whether you are in sandbox mode or production mode.
 * @returns {Promise} - Returns a promise that resolves to the transaction status response.
 */
async function mpesaQueryApi({
  checkoutRequestId,
  shortCode,
  passKey,
  baseURL,
  consumerKey,
  consumerSecret,
}) {
  const _shortCode = shortCode;
  const _passKey = passKey;
  const token = await generateOAuthToken(consumerKey, consumerSecret, baseURL);
  // Generate credentials
  const { password, timeStamp } = generateMpesaCredentials(
    _shortCode,
    _passKey,
  );
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  try {
    const response = await req.post("/mpesa/stkpushquery/v1/query", {
      BusinessShortCode: _shortCode,
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
