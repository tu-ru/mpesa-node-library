/**
 * generateQrCodeApi - Use this API to create a dynamic QR code for a specified transaction.
 * @name generateQrCodeApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/APIs/DynamicQRCode|Generate Dynamic QR Code}
 * @param {generateQrCodeApiOptions} options - Options for the QR code generation request.
 * @return {Promise<never>} - Returns a promise that resolves to the QR code data.
 */
declare function generateQrCodeApi(
  options: generateQrCodeApiOptions,
): Promise<never>;

interface generateQrCodeApiOptions {
  merchantName: string;
  refNo: string;
  amount: number;
  trxCode: "BG" | "WA" | "PB" | "SM" | "SB";
  cpi: string;
  size: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
}
export default generateQrCodeApi;
