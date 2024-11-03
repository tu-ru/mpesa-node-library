/**
 * C2B Register URL
 * @name c2bRegisterApi
 * @function
 * @description Use this API to register validation and confirmation URLs on M-Pesa.
 * @summary C2B payments require registration of URLs for validation and confirmation to handle transaction notifications.
 * @see {@link https://developer.safaricom.co.ke/c2b/apis/post/registerurl| C2B Register URL}
 * @param {c2BRegisterOptions} options - Options for the C2B Register URL.
 * @return {Promise<never>} - Returns a promise that resolves to the registration result.
 */
declare function c2bRegisterApi(options: c2BRegisterOptions): Promise<never>;

interface c2BRegisterOptions {
  confirmationUrl: string;
  validationUrl: string;
  shortCode: number;
  responseType: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
}

export default c2bRegisterApi;
