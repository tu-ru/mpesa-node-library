/**
 * Business PayBill - Use this API to pay bills directly from your business account to a pay bill number or store.
 * @name businessPaybillApi
 * @function
 * @description Transfers funds from an MMF/Working account to a recipient's utility account.
 * @see {@link https://developer.safaricom.co.ke/b2b/apis/post/paymentrequest|Business PayBill}
 * @param {businessPaybillApiOptions} options - Options for the business pay bill request.
 * @return {Promise<never>} - Returns a promise that resolves to the transaction response.
 */
declare function businessPaybillApi(
  options: businessPaybillApiOptions,
): Promise<never>;

interface businessPaybillApiOptions {
  initiator: string;
  securityCredential: string;
  commandId: string;
  senderIdentifierType: string;
  receiverIdentifierType: string;
  amount: number;
  partyA: number;
  partyB: number;
  accountReference: number;
  requester?: number;
  remarks: string;
  queueTimeOutURL: string;
  resultURL: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
  certPath: string;
}

export default businessPaybillApi;
