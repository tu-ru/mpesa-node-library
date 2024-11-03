import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Helper to generate Lipa Na M-Pesa password and timestamp
 * @param {number} shortCode - The business short code
 * @param {string} passKey - The Lipa Na M-Pesa passkey
 * @return {Object} - Returns the password and timestamp
 */
export function generateMpesaCredentials(shortCode, passKey) {
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
 * @param {string} consumerKey - The API consumer key
 * @param {string} consumerSecret - The API consumer secret
 * @param {string} baseURL - The base URL for the API
 * @return {Promise<string>} - Returns a promise that resolves to the access token
 * @throws {Error} - Throws an error if the token generation fails
 */
export async function generateOAuthToken(consumerKey, consumerSecret, baseURL) {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64",
  );
  try {
    const response = await axios.get(
      `${baseURL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate OAuth token:", error);
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
 * @param {string} certPath - The path to the certificate file.
 * @param {string} shortCodeSecurityCredential - The security credential to encrypt.
 * @returns {string} - The encrypted security credential encoded in base64.
 * @throws {Error} - Throws an error if the encryption fails or if the certificate cannot be read.
 */
export function encryptSecurityCredential(
  certPath,
  shortCodeSecurityCredential,
) {
  try {
    const bufferToEncrypt = Buffer.from(shortCodeSecurityCredential);
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
