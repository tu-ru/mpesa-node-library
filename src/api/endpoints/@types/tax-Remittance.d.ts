/**
 * Tax Remittance API - Enables businesses to remit tax to Kenya Revenue Authority (KRA).
 * @name taxRemittance
 * @function
 * @description Remits tax to the Kenya Revenue Authority using M-Pesa B2B API. Prior integration with KRA is required for tax declaration and PRN generation.
 * @see {@link https://developer.safaricom.co.ke/docs/apis/post/taxremittance|Tax Remittance API}
 * @param {TaxRemittanceOptions} options - Options for the tax remittance request.
 * @return {Promise<never>} - Returns a promise that resolves to the tax remittance transaction response.
 */
declare function taxRemittance(options: TaxRemittanceOptions): Promise<never>;

interface TaxRemittanceOptions {
  initiator: string;
  securityCredential: string;
  commandId: string;
  senderIdentifierType: string;
  receiverIdentifierType: string;
  amount: number;
  partyA: number;
  partyB: number;
  accountReference: number;
  remarks: string;
  queueTimeOutURL: string;
  resultURL: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
  certPath: string;
}

export default taxRemittance;
