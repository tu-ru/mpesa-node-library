import axios from "axios";
import { generateOAuthToken, throwErrorMessages } from "../utils/helpers.js";
import { trxCodeTypes } from "../utils/constants.js";

/**
 * Logs error details for advanced debugging.
 * @param {Error} error - The error object caught in the catch block.
 * @param {Object} context - Additional context about the API request, such as endpoint, method, and payload.
 */
function logErrorDetails(error, context) {
  console.error("QR code generation error details:", {
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
 * generateQrCodeApi - Creates a dynamic QR code for a specified transaction.
 * @name generateQrCodeApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/DynamicQRCode Generate Dynamic QR Code}
 * @param {Object} options - Options for the QR code generation request.
 * @param {string} options.merchantName - The name of the company or M-Pesa merchant requesting the QR code.
 * @param {string} options.refNo - A unique reference number for the transaction.
 * @param {number} options.amount - The total amount for the sale or transaction.
 * @param {string} options.trxCode - Transaction type. Supported types: BG, WA, PB, SM, SB.
 * @param {string} options.cpi - Credit Party Identifier (e.g., mobile number, business number).
 * @param {string} options.size - Size of the QR code image in pixels. QR code image will always be square.
 * @returns {Promise<Object>} - Returns a promise that resolves to the QR code data.
 */
async function generateQrCodeApi({
  merchantName,
  refNo,
  amount,
  trxCode,
  cpi,
  size,
}) {
  // Validate trxCode against allowed types
  const validTrxCodes = Object.values(trxCodeTypes);
  if (!validTrxCodes.includes(trxCode)) {
    throw new Error(
      `Invalid trxCode provided. Must be one of: ${validTrxCodes.join(", ")}`,
    );
  }

  try {
    // Generate OAuth token
    const { accessToken, baseURL } = await generateOAuthToken();

    // Set up the axios request with the generated OAuth token
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Execute the QR Code generation API request
    const response = await req.post("/mpesa/qrcode/v1/generate", {
      MerchantName: merchantName,
      RefNo: refNo,
      Amount: amount,
      TrxCode: trxCode,
      CPI: cpi,
      Size: size,
    });

    return response.data; // Return the response data directly
  } catch (error) {
    // Advanced error logging
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/qrcode/v1/generate",
      method: "POST",
      payload: {
        merchantName,
        refNo,
        amount,
        trxCode,
        cpi,
        size,
      },
    });

    // Categorize and handle error types
    throwErrorMessages(error);
  }
}

export default generateQrCodeApi;
