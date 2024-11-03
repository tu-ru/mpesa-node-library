/**
 * Reversal Request - Use this API to reverse an M-Pesa transaction.
 * @name reversalsApi
 * @function
 * @description This function allows you to reverse a transaction previously initiated on M-Pesa.
 * @see {@link https://developer.safaricom.co.ke/reversal/apis/post/request|Reversal Request}
 * @param {reversalsApiOptions} options - Options for the reversal request.
 * @returns {Promise<never>} - Returns a promise resolving to the transaction response.
 */
declare function reversalsApi(options: reversalsApiOptions): Promise<never>;

interface reversalsApiOptions {
  transactionId: string;
  amount: number;
  queueUrl: string;
  resultUrl: string;
  shortCode: number;
  remarks: string;
  occasion: string;
  initiator: string;
  receiverIdType: string;
  commandId: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
  certPath: string;
  securityCredential: string;
}

export default reversalsApi;
