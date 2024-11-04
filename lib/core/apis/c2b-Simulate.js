import { generateOAuthToken } from "../utils/helpers.js";
import axios from "axios";

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
 * @return {Promise} - Returns a promise that resolves to the simulation result.
 */
async function c2bSimulateApi({
  msisdn,
  amount,
  billRefNumber,
  commandId = "CustomerPayBillOnline",
  shortCode
}) {
  /** SIMULATE SHOULD ONLY BE PERFORMED IN SANDBOX MODE, NEVER IN PRODUCTION **/
  const {accessToken, baseURL} = await generateOAuthToken();
  if(baseURL === "https://sandbox.safaricom.co.ke"){
    throw new Error("CAN ONLY BE SIMULATED IN PRODUCTION MODE!")
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
    return responseBody.data;
  } catch (error) {
    console.error("C2B simulation failed:", error);
    throw new Error(
      "Unable to simulate C2B transaction. Please try again later.",
    );
  }
}

export default c2bSimulateApi;
