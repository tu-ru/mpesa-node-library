/**
 * C2B Simulate Transaction
 * @name c2bSimulateApi
 * @function
 * @description Use this API to simulate a C2B transaction.
 * @summary This function simulates a C2B (Customer to Business) transaction by initiating a payment from a phone number to a business shortcode.
 * @see {@link https://developer.safaricom.co.ke/c2b/apis/post/simulate | C2B Simulate Transaction }
 * @param {c2bSimulateApiOptions} options - Options for the C2B simulation.
 * @return {Promise<never>} - Returns a promise that resolves to the simulation result.
 */
declare function c2bSimulateApi(options: c2bSimulateApiOptions): Promise<never>;

interface c2bSimulateApiOptions {
  msisdn: number;
  amount: number;
  billRefNumber: string;
  commandId: string;
  shortCode: number;
  consumerKey: string;
  consumerSecret: string;
}

export default c2bSimulateApi;
