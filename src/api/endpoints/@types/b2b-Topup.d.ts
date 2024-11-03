/**
 * B2B Account Top-Up - Use this API to load funds to a B2B shortcode for disbursement.
 * @name b2bTopUpApi
 * @function
 * @description Transfers funds from an MMF/Working account to a recipient's utility account using a B2B shortcode.
 * @see {@link https://developer.safaricom.co.ke/b2b/apis/post/paymentrequest|B2B Account Top-Up}
 * @param {b2bTopUpApiOptions} options - Options for the B2B account top-up request.
 * @return {Promise<never>} - Returns a promise that resolves to the B2B transaction response.
 */
declare function b2bTopUpApi(options: b2bTopUpApiOptions): Promise<never>;

interface b2bTopUpApiOptions {
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

export default b2bTopUpApi;
