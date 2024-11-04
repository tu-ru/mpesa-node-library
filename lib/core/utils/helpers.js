import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import globalConfigs from "./configs.js";

/**
 * Helper to generate Lipa Na M-Pesa password and timestamp
 * @param {number} shortCode - The business short code
 * @return {Object} - Returns the password and timestamp
 */
export function generateMpesaCredentials(shortCode) {
  const { passKey} = globalConfigs
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
 * Helper to generate an OAuth token for API authentication
 * @return {Promise<{baseURL: string, accessToken: string}>} - Returns a promise that resolves to the access token and baseURL
 * @throws {Error} - Throws an error if the token generation fails
 */
export async function generateOAuthToken() {
  const { consumerKey, consumerSecret, baseUrl } = globalConfigs;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  try {
    const response = await axios.get(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    return { accessToken: response.data.access_token, baseURL: baseUrl }; // Avoid re-declaring baseURL
  } catch (error) {
    console.error("Failed to generate OAuth token:", error.message);
    throw new Error("Unable to generate OAuth token.");
  }
}


/**
 * Helper to generate a unique identifier (UUID) for the originator ID
 * @return {string} - Returns a unique identifier in UUID format
 */
export function originatorID() {
  return uuidv4();
}
/**
 * Encrypts the security credential using a public key from a certificate file.
 * @returns {string} - The encrypted security credential encoded in base64.
 * @throws {Error} - Throws an error if the encryption fails or if the certificate cannot be read.
 */
export function encryptSecurityCredential() {
  const { securityCredential, certPath} = globalConfigs
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
