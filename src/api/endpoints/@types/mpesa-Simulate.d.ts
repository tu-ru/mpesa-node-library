/**
 * Lipa Na M-Pesa Online Payment API - Use this API to initiate online payment on behalf of a customer.
 * @name lipaNaMpesaOnline
 * @function
 * @description Initiate an online payment from a customer's MSISDN to a business via Lipa Na M-Pesa.
 * @see {@link https://developer.safaricom.co.ke/lipa-na-m-pesa-online/apis/post/processrequest|Lipa Na M-Pesa Online Payment Request}
 * @param {MpesaSimulateApiOptions} options - Options for the Lipa Na M-Pesa Online Payment request.
 * @return {Promise<never>} - Returns a promise that resolves to the transaction result.
 */
declare function mpesaSimulateApi(
  options: MpesaSimulateApiOptions,
): Promise<never>;

interface MpesaSimulateApiOptions {
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
  msisdn1: number;
  msisdn2: number;
  amount: number;
  callbackUrl: string;
  accountRef: string;
  transactionDesc: string;
  transactionType: string;
  shortCode: number;
  passKey: string;
}

export default mpesaSimulateApi;
