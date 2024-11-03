/**
 * Lipa Na M-Pesa Query Request API - Use this API to check the status of a Lipa Na M-Pesa Online Payment.
 * @name mpesaQueryApi
 * @function
 * @description Check the status of a Lipa Na M-Pesa Online Payment using the Checkout RequestID.
 * @see {@link https://developer.safaricom.co.ke/lipa-na-m-pesa-online/apis/post/stkpush/v1/processrequest|Lipa Na M-Pesa Query Request}
 * @param {mpesaQueryOptions} options - Options for the Lipa Na M-Pesa Query request.
 * @return {Promise<never>} - Returns a promise that resolves to the transaction status response.
 */
declare function mpesaQueryApi(options: mpesaQueryOptions): Promise<never>;

interface mpesaQueryOptions {
  checkoutRequestId: string;
  shortCode: number;
  passKey: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
}

export default mpesaQueryApi;
