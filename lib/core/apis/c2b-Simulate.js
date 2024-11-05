import { generateOAuthToken, throwErrorMessages } from "../utils/helpers.js";
import axios from "axios";

/**
 * Logs detailed error information for easier debugging.
 * @param {Error} error - The error object thrown by the API request.
 * @param {Object} context - Additional context about the request, such as endpoint and payload.
 */
function logErrorDetails(error, context) {
  console.error("C2B Simulation transaction error details:", {
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
 * C2B Simulate Transaction
 * @name c2bSimulateApi
 * @function
 * @description Use this API to simulate a C2B transaction.
 * @summary This function simulates a C2B (Customer to Business) transaction by initiating a payment from a phone number to a business shortcode.
 * @see {@link https://developer.safaricom.co.ke/c2b/apis/post/simulate | C2B Simulate Transaction }
 * @param {Object} options - Options for the C2B simulation.
 * @param {number} options.msisdn - Phone number (MSISDN) initiating the transaction.
 * @param {number} options.amount - The amount being transacted.
 * @param {string} options.billRefNumber - Bill reference number.
 * @param {string} [options.commandId='CustomerPayBillOnline'] - Unique command for each transaction type (default: CustomerPayBillOnline).
 * @param {number} [options.shortCode=null] - Shortcode receiving the amount (default: configured short code).
 * @return {Promise<Object>} - Returns a promise that resolves to the simulation result.
 */
async function c2bSimulateApi({
  msisdn,
  amount,
  billRefNumber,
  commandId = "CustomerPayBillOnline",
  shortCode,
}) {
  /** SIMULATE SHOULD ONLY BE PERFORMED IN SANDBOX MODE, NEVER IN PRODUCTION **/
  const { accessToken, baseURL } = await generateOAuthToken();

  if (baseURL === "https://api.safaricom.co.ke") {
    throw new Error(
      "Simulation is allowed only in development or sandbox environment!",
    );
  }

  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  try {
    const responseBody = await req.post(`/mpesa/c2b/v1/simulate`, {
      ShortCode: shortCode,
      CommandID: commandId,
      Amount: amount,
      Msisdn: msisdn,
      BillRefNumber: billRefNumber,
    });

    return responseBody.data; // Return the response data directly
  } catch (error) {
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/c2b/v1/simulate",
      method: "POST",
      payload: {
        msisdn,
        amount,
        billRefNumber,
        commandId,
        shortCode,
      },
    });

    // Categorize error messages based on the response
    throwErrorMessages(error);
  }
}

export default c2bSimulateApi;
