import axios from "axios";
import { generateOAuthToken, throwErrorMessages } from "../utils/helpers.js";
import { responseTypes } from "../utils/constants.js";

/**
 * Logs detailed error information to assist in debugging.
 * @param {Error} error - The error object thrown by the API request.
 * @param {Object} context - Additional context about the request, such as endpoint and payload.
 */
function logErrorDetails(error, context) {
  console.error("C2B Register transaction error details:", {
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
 * C2B Register URL - NOT SIMULATION
 * @name C2BRegister
 * @function
 * @description Use this API to register validation and confirmation URLs on M-Pesa.
 * @summary C2B payments require registration of URLs for validation and confirmation to handle transaction notifications.
 * @see {@link https://developer.safaricom.co.ke/APIs/BusinessToCustomer C2B Register URL}
 * @param {Object} options - Options for the C2B Register URL.
 * @param {string} options.confirmationUrl - Confirmation URL for the client.
 * @param {string} options.validationUrl - Validation URL for the client.
 * @param {number} [options.shortCode=null] - The short code of the organization (default: configured short code).
 * @param {string} [options.responseType=responseTypes.COMPLETED] - Default response type for timeout. In case a transaction times out, M-Pesa will default to Complete or Cancel the transaction.
 * @return {Promise<Object>} - Returns a promise that resolves to the registration result.
 */
async function c2bRegisterApi({
  confirmationUrl,
  validationUrl,
  shortCode,
  responseType = responseTypes.COMPLETED,
}) {
  // Validate responseType
  const validResponseTypes = Object.values(responseTypes);
  if (!validResponseTypes.includes(responseType)) {
    throw new Error(
      `Invalid responseType provided. Must be one of: ${validResponseTypes.join(", ")}`,
    );
  }

  // OAuth token generation function
  const { accessToken, baseURL } = await generateOAuthToken();

  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await req.post("/mpesa/c2b/v1/registerurl", {
      ShortCode: shortCode,
      ResponseType: responseType,
      ConfirmationURL: confirmationUrl,
      ValidationURL: validationUrl,
    });

    return response.data; // Return the response data directly
  } catch (error) {
    // Log detailed error information
    logErrorDetails(error, {
      apiEndpoint: "/mpesa/c2b/v1/registerurl",
      method: "POST",
      payload: {
        confirmationUrl,
        validationUrl,
        shortCode,
        responseType,
      },
    });

    // Categorize and throw user-friendly error messages
    throwErrorMessages(error);
  }
}

export default c2bRegisterApi;
