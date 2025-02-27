import axios from "axios";
import {
  generateOAuthToken,
  logErrorDetails,
  throwErrorMessages,
} from "../utils/helpers.js";
import { trxCodeTypes } from "../utils/constants.js";

/**
 * @name generateQrCode
 * @description This generates a Dynamic QR which enables Safaricom M-PESA customers who have My Safaricom App or M-PESA app, to scan a QR (Quick Response) code, to capture till number and amount
 * @summary Generates QR codes for customers using My Safaricom app
 * @see {@link https://developer.safaricom.co.ke/APIs/DynamicQRCode open external link}
 * @param {Object} options Options for the QR code generation request.
 * @param {string} options.merchantName - The name of the company or M-Pesa merchant requesting the QR code.
 * @param {string} options.refNo A unique reference number for the transaction.
 * @param {number} options.amount The total amount for the sale or transaction.
 * @param {string} options.trxCode Transaction type. Supported types: BG, WA, PB, SM, SB.
 * @param {string} options.cpi Credit Party Identifier (e.g., mobile number, business number).
 * @param {string} options.size Size of the QR code image in pixels. QR code image will always be square.
 * @param {boolean} [options.proErrorLogging] Logs out advanced error details - good for debugging
 * @returns {Promise<Object>} generateQrcodeResponse.
 */
async function generateQrCode({
  merchantName,
  refNo,
  amount,
  trxCode,
  cpi,
  size,
  proErrorLogging = false,
}) {
  /**
   * @param {string} validTrxCodes - Only support: buy goods: "BG" - withdraw agent till: "WA" - paybill business number: "PB" - send money msisdn: "SM" and end to business msisdn: "SB"
   */
  const validTrxCodes = Object.values(trxCodeTypes);
  if (!validTrxCodes.includes(trxCode)) {
    throw new Error(
      `Invalid trxCode provided. Must be one of: ${validTrxCodes.join(", ")}`,
    );
  }
  try {
    const { accessToken, baseURL } = await generateOAuthToken();
    const req = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const responseBody = await req.post("/mpesa/qrcode/v1/generate", {
      MerchantName: merchantName,
      RefNo: refNo,
      Amount: amount,
      TrxCode: trxCode,
      CPI: cpi,
      Size: size,
    });
    return { generateQrcodeResponse: responseBody.data };
  } catch (error) {
    if (proErrorLogging) {
      console.info(
        "\x1b[35m%s\x1b[0m",
        "Advanced error logging for generateQrcode has been initialized",
      );
      logErrorDetails(
        error,
        {
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
        },
        "QR code generation error details:",
      );
    }
    throw throwErrorMessages(error);
  }
}

export { generateQrCode };
