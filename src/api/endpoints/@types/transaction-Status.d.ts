/**
 * Transaction Status Request - Use this API to check the status of a transaction on M-Pesa.
 * @name transactionStatusApi
 * @function
 * @description This function allows you to query the status of a transaction initiated on M-Pesa.
 * @see {@link https://developer.safaricom.co.ke/transaction-status/apis/post/query|Transaction Status Request}
 * @param {transactionStatusApiOptions} options - Options for the transaction status request.
 * @returns {Promise<never>} - Returns a promise resolving to the transaction status response.
 */
declare function transactionStatusApi(
  options: transactionStatusApiOptions,
): Promise<never>;

interface transactionStatusApiOptions {
  transactionId: string;
  receiverParty: number;
  idType: number;
  queueUrl: string;
  resultUrl: string;
  remarks: string;
  occasion: string;
  initiator: string;
  commandId: string;
  securityCredential: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
  certPath: string;
}

export default transactionStatusApi;
