import axios from "axios";
import {
  generateMpesaCredentials,
  generateOAuthToken,
} from "../utils/helpers.js";
/**
 * Lipa Na M-Pesa Online Payment - Use this API to initiate an online payment on behalf of a customer.
 * @name mpesaSimulateApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate Payment Request}
 * @param {Object} options - Options for the Lipa Na M-Pesa online payment request.
 * @param {number} options.msisdn1 - The MSISDN sending the funds.
 * @param {number} options.msisdn2 - The MSISDN receiving the STK pin prompt, can be similar to msisdn1
 * @param {number} options.amount - The amount to be transacted.
 * @param {string} options.callbackUrl - Callback URL for payment notification.
 * @param {string} options.accountRef - Account Reference for the transaction.
 * @param {string} [options.transactionDesc='OK!'] - Description of the transaction.
 * @param {string} [options.transactionType='CustomerPayBillOnline'] - Transaction type.
 * @param {number} [options.shortCode] - Organization shortcode used to receive the transaction.
 * @returns {Promise} - Returns a promise that resolves to the payment response.
 */
async function mpesaSimulateApi({
  msisdn1,
  msisdn2,
  amount,
  callbackUrl,
  accountRef,
  transactionDesc = "OK!",
  transactionType = "CustomerPayBillOnline",
  shortCode,
}) {
  const { accessToken, baseURL } = await generateOAuthToken();
  const { password, timeStamp } = generateMpesaCredentials(shortCode);
  const req = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  try {
    // Make the request to M-Pesa API
    const response = await req.post("/mpesa/stkpush/v1/processrequest", {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timeStamp,
      Amount: amount,
      PartyA: msisdn1, //phone number sending the money
      PartyB: shortCode, //organization receiving the funds
      PhoneNumber: msisdn2, //phone number receiving STK - can be same as PartyA
      CallBackURL: callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: transactionDesc,
      TransactionType: transactionType,
    });

    return response.data;
  } catch (error) {
    console.error("Error initiating Lipa Na M-Pesa payment:", error);
    throw new Error(
      "Failed to initiate Lipa Na M-Pesa payment. Please try again later.",
    );
  }
}

export default mpesaSimulateApi;
