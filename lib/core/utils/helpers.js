import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import globalConfigs from "./configs.js";
import EventEmitter from "events";

const emitter = new EventEmitter();

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
  return null;
}

/**
 * Logs error details for advanced debugging.
 * @param {Error} error - The error object caught in the catch block.
 * @param {Object} context - Additional context about the API request, such as endpoint, method, and payload.
 * @param {string} apiTypeMsg - Carries advanced error details for better debugging
 * */
export function logErrorDetails(error, context, apiTypeMsg) {
  console.error(apiTypeMsg, {
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
 * Validates that a URL starts with "https://"
 * @param {string} url - The URL to validate
 * @param {string} name - The parameter name (for error messages)
 * @throws {Error} If the URL is invalid
 */
export function validateUrl(url, name) {
  if (!url || !url.startsWith("https://")) {
    throw new Error(`${name} must be a valid HTTPS URL.`);
  }
}

/**
 * @name validateFormatPhone
 * @description Formats Kenyan phone numbers (e.g., 0711256844) to API standard (254711256844).
 * @param {string} number - The phone number to be formatted.
 * @returns {number} - Formatted phone number as an integer (`254XXXXXXXXX`).
 * @throws {Error} - If the input is invalid or does not match the expected format.
 */
export function validateFormatPhone(number) {
  if (typeof number !== "string") {
    throw new Error("Invalid input: phone number must be a string.");
  }
  let phoneStr = String(number).trim().replace(/\D/g, "");
  if (phoneStr.length !== 10 || !phoneStr.startsWith("0")) {
    throw new Error(
      `Invalid phone number: must be exactly 10 digits and start with '0'}`,
    );
  }
  return Number(`254${phoneStr.substring(1)}`);
}

/**
 * Recursively flattens a nested object into a single-level object with
 * concatenated keys separated by underscores.
 *
 * @param {Object} obj - The object to flatten.
 * @param {string} [prefix=""] - A prefix for nested keys (used for recursion).
 * @returns {Object} - A new object with flattened keys.
 *
 * @example
 * const nestedObj = { a: { b: { c: 1 }, d: 2 }, e: 3 };
 * const flattened = flattenObject(nestedObj);
 * console.log(flattened);
 * // Output: { "a_b_c": 1, "a_d": 2, "e": 3 }
 */
function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}_${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
}

/**
 * Handles M-Pesa callback registration.
 * @param {Object} appInstance - Express app instance.
 * @param {string} endpoint - Api endpoint name
 */
export async function handleCallbacks(appInstance, endpoint) {
  try {
    if (!appInstance || typeof appInstance.post !== "function") {
      throw new Error(
        "handleBalanceQueryCallbacks requires a valid Express app instance.",
      );
    }

    let resultRoute,
      timeoutRoute = "";

    switch (endpoint) {
      case "balanceQuery":
        resultRoute = "/accountbalance/result";
        timeoutRoute = "/accountbalance/queuetimeouturl";
        break;
      case "c2bRegister":
        resultRoute = "/confirmation/result";
        timeoutRoute = "/validation/result";
        break;
      case "reversals":
        resultRoute = "/Reversal/result";
        timeoutRoute = "/Reversal/queuetimeouturl";
        break;
      case "mpesaSimulate":
        resultRoute = "/path/result";
        timeoutRoute = "";
        break;
      case "transactionStatus":
        resultRoute = "/TransactionStatus/result/";
        timeoutRoute = "/TransactionStatus/queue/";
        break;
      case "b2cTopUp":
        resultRoute = "/path/result";
        timeoutRoute = "/path/queue";
        break;
      case "b2cRequest":
        resultRoute = "/b2c/result";
        timeoutRoute = "/b2c/queue";
        break;
      case "businessPaybill":
        resultRoute = "/path/result";
        timeoutRoute = "/path/queue";
        break;
      case "taxRemittance":
        resultRoute = "/remittax/result";
        timeoutRoute = "/remittax/queue";
        break;
      default:
        throw new Error(`Invalid endpoint provided:, ${endpoint}`);
    }
    appInstance.post(resultRoute, (req, res) => {
      const flattenedData = flattenObject(req.body);
      emitter.emit("callbackResult", flattenedData);
      res.status(200).send("Callback post success");
    });
    appInstance.post(timeoutRoute, (req, res) => {
      const flattenedData = flattenObject(req.body);
      emitter.emit("callbackTimeout", flattenedData);
      res.status(200).send("Queue post success");
    });
    console.info(
      "\x1b[32m\x1b[1m%s\x1b[0m",
      `Callback handler for ${endpoint} has been initialized.`,
    );
  } catch (error) {
    throw new Error(`Callback Error: ${error}`);
  }
}

export async function callbackTrigger(state, specialCase = false) {
  if (state) {
    return await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn(
          "\x1b[43m\x1b[1m\x1b[30m%s\x1b[0m",
          "No callback received within the time limit.",
        );
        resolve({ type: "timeout", data: {} });
      }, 15000);

      const callbackHandler = (data) => {
        clearTimeout(timeout);
        resolve({ type: "result", data });
      };

      const timeoutHandler = (data) => {
        clearTimeout(timeout);
        resolve({ type: "timeout", data });
      };

      if (specialCase) {
        emitter.once("callbackResult", callbackHandler);
      } else {
        emitter.once("callbackResult", callbackHandler);
        emitter.once("callbackTimeout", timeoutHandler);
      }
    });
  }
}
