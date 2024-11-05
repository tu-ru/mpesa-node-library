import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import globalConfigs from "./configs.js";

// Validate required environment variables
const validateGlobalConfigs = () => {
  const requiredConfigs = [
    "consumerKey",
    "consumerSecret",
    "securityCredential",
    "passKey",
    "certPath",
    "environment",
    "baseUrl",
  ];

  const missingConfigs = requiredConfigs.filter(
    (config) => !globalConfigs[config],
  );

  if (missingConfigs.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingConfigs.join(", ")}`,
    );
  }
};

// Call validation function to ensure all necessary environment variables are defined
validateGlobalConfigs();

/**
 * Helper to generate a unique identifier (UUID) for the originator ID
 * @return {string} - Returns a unique identifier in UUID format
 */
export function originatorID() {
  return uuidv4();
}

/**
 * Helper to generate an OAuth token for API authentication
 * @return {Promise<{baseURL: string, accessToken: string}>} - Returns a promise that resolves to the access token and baseURL
 * @throws {Error} - Throws an error if the token generation fails
 */
export async function generateOAuthToken() {
  const { consumerKey, consumerSecret, baseUrl } = globalConfigs;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64",
  );

  try {
    const response = await axios.get(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      },
    );
    return { accessToken: response.data.access_token, baseURL: baseUrl };
  } catch (error) {
    console.error("Failed to generate OAuth token:", error.message);
    throw new Error("Unable to generate OAuth token.");
  }
}

/**
 * Helper to generate Lipa Na M-Pesa password and timestamp
 * @param {number} shortCode - The business short code
 * @return {Object} - Returns the password and timestamp
 */
export function generateMpesaCredentials(shortCode) {
  const { passKey } = globalConfigs;
  const timeStamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
  const password = Buffer.from(`${shortCode}${passKey}${timeStamp}`).toString(
    "base64",
  );
  return { password, timeStamp };
}

/**
 * Encrypts the security credential using a public key from a certificate file.
 * @returns {string} - The encrypted security credential encoded in base64.
 * @throws {Error} - Throws an error if the encryption fails or if the certificate cannot be read.
 */
export function encryptSecurityCredential() {
  const { securityCredential, certPath } = globalConfigs;
  try {
    const bufferToEncrypt = Buffer.from(securityCredential);
    const data = fs.readFileSync(path.resolve(certPath));
    const privateKey = String(data);

    const encrypted = crypto.publicEncrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      bufferToEncrypt,
    );

    return encrypted.toString("base64");
  } catch (error) {
    console.error("Failed to encrypt security credential:", error.message);
    throw new Error(
      "Encryption of security credential failed. Please check the certificate path and credential.",
    );
  }
}

/**
 * Handles errors encountered during API requests to the M-Pesa service.
 *
 * This function analyzes the error object thrown by Axios during an API
 * call, providing detailed logging and user-friendly error messages based
 * on the type and nature of the error. The function handles three main
 * scenarios:
 *
 * 1. **API Error Responses**: If the error is due to a response from the
 *    M-Pesa API (i.e., the server responded with a status code):
 *    - 400: Indicates a bad request, suggesting that the parameters
 *      provided are invalid.
 *    - 401: Indicates unauthorized access, which suggests that the access
 *      token may be invalid.
 *    - 500 and above: Indicates a server error, prompting the user to
 *      retry the request later.
 *
 * 2. **Network Errors**: If the error occurs due to an issue with the
 *    network (i.e., no response received), it logs the error message and
 *    notifies the user that there may be a connection problem.
 *
 * 3. **Unexpected Errors**: If the error does not fall into the above
 *    categories, it logs the unexpected error message and throws a generic
 *    error message for the user.
 *
 * The function leverages the Axios error object, which contains
 * properties like `response`, `request`, and `message` to determine the
 * nature of the error. This structured approach ensures that developers
 * can debug issues effectively while providing clear feedback to end users.
 *
 * @param {Error} error - The error object thrown by Axios during the API request.
 * @throws {Error} - Throws a user-friendly error message based on the type of error encountered.
 */
export function throwErrorMessages(error) {
  if (error.response) {
    console.error("M-Pesa API Error:", {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });

    // Handle specific error responses from M-Pesa API
    if (error.response.status === 400) {
      throw new Error("Invalid request: Please check the parameters provided.");
    } else if (error.response.status === 401) {
      throw new Error(
        "Unauthorized: Invalid access token. Please verify your credentials.",
      );
    } else if (error.response.status >= 500) {
      throw new Error("M-Pesa server error: Please try again later.");
    }
  } else if (error.request) {
    console.error("Network Error:", error.message);
    throw new Error(
      "Network error: Unable to reach M-Pesa API. Please check your connection.",
    );
  } else {
    console.error("Unexpected Error:", error.message);
    throw new Error("Unexpected error occurred. Please try again later.");
  }
}
