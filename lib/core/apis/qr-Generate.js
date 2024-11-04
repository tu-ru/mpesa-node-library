import axios from "axios";
import { generateOAuthToken } from "../utils/helpers.js";
import { trxCodeTypes } from "../utils/constants.js";

/**
 * generateQrCodeApi - Use this API to create a dynamic QR code for a specified transaction.
 * Simultaneously generates an OAuth token using the consumer key and secret.
 * @name generateQrCodeApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/DynamicQRCode Generate Dynamic QR Code}
 * @param {Object} options - Options for the QR code generation request.
 * @param {string} options.merchantName - The name of the company or M-Pesa merchant requesting the QR code.
 * @param {string} options.refNo - A unique reference number for the transaction.
 * @param {number} options.amount - The total amount for the sale or transaction.
 * @param {string} options.trxCode - Transaction type. Supported types:
 *     - BG: Pay Merchant (Buy Goods).
 *     - WA: Withdraw Cash at Agent Till.
 *     - PB: Paybill or Business number.
 *     - SM: Send Money (Mobile number).
 *     - SB: Sent to Business. Business number in MSISDN format.
 * @param {string} options.cpi - Credit Party Identifier. Can be a mobile number, business number, agent till, paybill or business number, or merchant Buy Goods number.
 * @param {string} options.size - Size of the QR code image in pixels. QR code image will always be square.
 * @return {Promise<Object>} - Returns a promise that resolves to the QR code data.
 */

async function generateQrCodeApi({
  merchantName,
  refNo,
  amount,
  trxCode,
  cpi,
  size
}) {
  const validCommandIds = Object.values(trxCodeTypes);
  if (!validCommandIds.includes(trxCode)) {
    throw new Error(
      `Invalid commandId provided. Must be one of: ${validCommandIds.join(", ")}`,
    );
  }
  // Generate OAuth token
  const { accessToken, baseURL } = await generateOAuthToken();

  // Prepare the request instance with OAuth token
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  // Execute the Dynamic QR Code API request
  try {
    const response = await req.post("/mpesa/qrcode/v1/generate", {
      MerchantName: merchantName,
      RefNo: refNo,
      Amount: amount,
      TrxCode: trxCode,
      CPI: cpi,
      Size: size,
    });
    return response.data; // Return the QR code data directly
  } catch (error) {
    console.error("Failed to generate dynamic QR code:", error);
    throw new Error(
      "Unable to generate dynamic QR code. Please try again later.",
    );
  }
}

export default generateQrCodeApi;
