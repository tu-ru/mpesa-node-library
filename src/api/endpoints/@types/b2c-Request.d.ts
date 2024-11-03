/**
 * B2C Payment Request - Use this API to transact between an M-Pesa shortcode and a phone number registered on M-Pesa.
 * @name b2cRequestApi
 * @function
 * @description B2C payments involve a business sending money to an individual. This is a direct transaction from a business shortcode to a consumer's mobile number (MSISDN).
 * @see {@link https://developer.safaricom.co.ke/b2c/apis/post/request|B2C Payment Request}
 * @param {b2cRequestApiOptions} options - Options for the B2C payment request.
 * @return {Promise<never>} - Returns a promise that resolves to the transaction result.
 */
declare function b2cRequestApi(options: b2cRequestApiOptions): Promise<never>;

interface b2cRequestApiOptions {
  senderParty: number;
  receiverParty: number;
  amount: number;
  queueUrl: string;
  resultUrl: string;
  commandId: string;
  initiatorName: string;
  remarks: string;
  occasion: string;
  consumerKey: string;
  consumerSecret: string;
}

export default b2cRequestApi;
