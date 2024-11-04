import axios from "axios";
import { generateOAuthToken } from "../utils/helpers.js";
import { responseTypes } from "../utils/constants.js";

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
 * @return {Promise} - Returns a promise that resolves to the registration result.
 */
async function c2bRegisterApi({
  confirmationUrl,
  validationUrl,
  shortCode,
  responseType = responseTypes.COMPLETED,
}) {
  // Validate commandId
  const validCommandIds = Object.values(responseTypes);
  if (!validCommandIds.includes(responseType)) {
    throw new Error(
      `Invalid commandId provided. Must be one of: ${validCommandIds.join(", ")}`,
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
    console.error("C2B registration failed:", error);
    throw new Error(
      "Unable to complete C2B registration. Please try again later.",
    );
  }
}

export default c2bRegisterApi;
