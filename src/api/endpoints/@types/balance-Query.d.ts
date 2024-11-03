/**
 * AccountBalance - Use this API to enquire the balance on an M-Pesa BuyGoods (Till Number).
 * @name balanceQueryApi
 * @function
 * @see {@link https://developer.safaricom.co.ke/account-balance/apis/post/query|Account Balance Request}
 * @param {BalanceQueryOptions} options - Options for the account balance query.
 * @return {Promise<never>} - Returns a promise that resolves to the account balance or transaction status.
 */
declare function balanceQueryApi(options: BalanceQueryOptions): Promise<never>;

interface BalanceQueryOptions {
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
  certPath: string;
  shortCode: number;
  idType: number;
  queueUrl: string;
  resultUrl: string;
  remarks: string;
  initiator: string;
}

export default balanceQueryApi;
