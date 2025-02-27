/**
 * @name balanceQueryOptions
 * @param {Object} options Options for the balance query API.
 * @param {number} options.partyA The shortcode of the querying organization.
 * @param {number} options.identifierType Type of the querying organization.
 * @param {String} options.QueueTimeOutURL URL to receive timeout messages.
 * @param {String} options.resultUrl URL to receive the result message.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {String} options.initiator The credential/username for authentication.
 */
export interface balanceQueryOptions {
  partyA: number;
  identifierType: number;
  QueueTimeOutUrl: string;
  resultUrl: string;
  initiator: string;
  remarks: string;
}

/**
 * @name b2cRequestOptions
 * @param {Object} options Options for the B2C payment request.
 * @param {number} options.partyA The B2C organization shortcode sending the money.
 * @param {string} options.partyB Customer mobile number (with country code, e.g., 254).
 * @param {number} options.amount The amount being transacted.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {string} options.occasion Information to be associated with the transaction.
 * @param {string} options.QueueTimeOutURL URL for timeout notifications.
 * @param {string} options.resultUrl URL for M-PESA to send payment processing notifications.
 * @param {string} options.commandId Unique command specifying B2C transaction type (e.g., BusinessPayment).
 * @param {string} options.initiatorName API user created by Business Administrator for B2C transactions.
 */
export interface b2cRequestOptions {
  partyA: number;
  partyB: string;
  amount: number;
  QueueTimeOutUrl: string;
  resultUrl: string;
  commandId: string;
  initiatorName: string;
  remarks: string;
  occasion: string;
}

/**
 * @name c2bRegisterOptions
 * @param {Object} options Options for the C2B Register URL.
 * @param {string} options.confirmationUrl URL to receive confirmation upon payment completion.
 * @param {string} options.validationUrl URL to receive validation upon payment submission (default: external validation disabled).
 * @param {number} options.shortCode Unique M-PESA pay bill/till number.
 * @param {string} options.responseType Action if validation URL is unreachable (values: Completed or Cancelled).
 */
export interface c2bRegisterOptions {
  confirmationUrl: string;
  validationUrl: string;
  shortCode: number;
  responseType: string;
}

/**
 * @name c2bSimulateOptions
 * @param {Object} options Options for the C2B simulation.
 * @param {string} options.msisdn The MSISDN receiving the transaction
 * @param {number} options.amount Transaction amount.
 * @param {string} options.billRefNumber Bill reference number e.g. "invoice008".
 * @param {number} options.shortCode Usually, a unique number is tagged to an M-PESA pay bill/till number of the organization*/
export interface c2bSimulateOptions {
  msisdn: string;
  amount: number;
  billRefNumber: string;
  shortCode: number;
}

/**
 * @name mpesaSimulateOptions
 * @param {Object} options Options for M-Pesa express API.
 * @param {string} options.partyA Sender's Safaricom mobile number (M-PESA registered).
 * @param {string} options.phoneNumber Mobile number to receive the STK Pin Prompt (can be same as partyA).
 * @param {number} options.amount Transaction amount.
 * @param {string} options.transactionType "CustomerPayBillOnline" for PayBill and "CustomerBuyGoodsOnline" for Till Numbers.
 * @param {string} options.callbackUrl Secure URL for receiving notifications from M-Pesa API.
 * @param {string} options.transactionDesc Information to be associated with the transaction.
 * @param {string} options.accountRef Alphanumeric account reference (up to 12 characters) shown in the STK Pin Prompt.
 * @param {number} options.partyB 5 to 6-digit number of the receiving organization.
 */
export interface mpesaSimulateOptions {
  partyA: string;
  phoneNumber: string;
  amount: number;
  callbackUrl: string;
  accountRef: string;
  transactionType: string;
  partyB: number;
  transactionDesc: string;
}

/**
 * @name mpesaQueryOptions
 * @param {Object} options Options for the Lipa Na M-Pesa query API.
 * @param {string} options.checkoutRequestId Unique identifier for the processed checkout transaction.
 * @param {number} options.businessShortCode Organization's shortcode (Paybill or Buygoods, 5-7 digits).
 */
export interface mpesaQueryOptions {
  checkoutRequestId: string;
  businessShortCode: number;
}

/**
 * @name reversalsOptions
 * @param {Object} options Options for the reversal API.
 * @param {string} options.transactionId Transaction ID for reversal (e.g., LKXXXX1234).
 * @param {number} options.amount Amount to be reversed.
 * @param {string} options.QueueTimeOutURL URL for timeout transaction details.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {string} options.occasion Information to be associated with the transaction.
 * @param {string} options.resultUrl URL for transaction details.
 * @param {number} options.receiverParty Organization receiving the transaction.
 * @param {string} options.initiator Name of the initiator of the request.
 */
export interface reversalsOptions {
  transactionId: string;
  amount: number;
  QueueTimeOutUrl: string;
  resultUrl: string;
  receiverParty: string;
  initiator: string;
  receiverIdType: string;
  remarks: string;
  occasion: string;
}

/**
 * @name transactionStatusOptions
 * @param {Object} options Options for the transaction status API.
 * @param {string} options.transactionId Unique identifier for the transaction on M-Pesa.
 * @param {string} options.initiator Name of the initiator of the request.
 * @param {number} options.partyA Organization/MSISDN receiving the transaction.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {string} options.occasion Information to be associated with the transaction.
 * @param {number} options.identifierType Type of organization receiving the transaction.
 * @param {string} options.OriginatorConversationID This is a globally unique identifier for the transaction request returned by the API proxy upon successful submission.
 * @param {string} options.QueueTimeOutUrl URL for timeout transaction details.
 * @param {string} options.resultUrl URL for transaction details.
 */
export interface transactionStatusOptions {
  transactionId: string;
  partyA: number;
  identifierType: number;
  QueueTimeOutUrl: string;
  resultUrl: string;
  initiator: string;
  OriginatorConversationID: string;
  remarks: string;
  occasion: string;
}

/**
 * @name generateQrCodeOptions
 * @param {Object} options Options for the QR code generation request.
 * @param {string} options.merchantName Name of the company or M-Pesa merchant requesting the QR code.
 * @param {string} options.refNo Unique reference number for the transaction.
 * @param {number} options.amount Total amount for the sale or transaction.
 * @param {string} options.trxCode Transaction type (BG, WA, PB, SM, SB).
 * @param {string} options.cpi Credit Party Identifier (e.g., mobile number, business number).
 * @param {string} options.size QR code image size in pixels (square).
 *  */
export interface generateQrCodeOptions {
  merchantName: string;
  refNo: string;
  amount: number;
  trxCode: "BG" | "WA" | "PB" | "SM" | "SB";
  cpi: string;
  size: string;
}

/**
 * @name b2cTopUpOptions
 * @param {Object} options B2C account top-up request options.
 * @param {string} options.initiator M-Pesa API operator username with Org Business Pay to Bulk API role.
 * @param {number} options.amount Transaction amount.
 * @param {number} options.partyA Shortcode from which money will be deducted.
 * @param {number} options.partyB Shortcode to which money will be moved.
 * @param {string} options.remarks Information to be associated with the transaction. * @param {number} options.accountReference Transaction identifier.
 * @param {number} [options.requester] Optional consumer’s mobile number (if paying on their behalf).
 * @param {string} options.QueueTimeOutURL URL for timeout notifications.
 * @param {string} options.resultUrl URL for sending transaction results after processing.
 */
export interface b2cTopUpOptions {
  initiator: string;
  amount: number;
  partyA: number;
  partyB: number;
  accountReference: number;
  requester?: number;
  QueueTimeOutURL: string;
  resultURL: string;
  remarks: string;
}

/**
 * @name businessPaybillOptions
 * @param {Object} options Options for the business pay bill.
 * @param {string} options.initiator M-Pesa API operator username with Org Business Pay Bill API role.
 * @param {number} options.amount Transaction amount.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {number} options.partyA Shortcode from which money will be deducted.
 * @param {number} options.partyB Shortcode to which money will be moved.
 * @param {number} options.accountReference Account number for the payment (up to 13 characters).
 * @param {number} [options.requester] Optional consumer’s mobile number (if paying on their behalf).
 * @param {string} options.QueueTimeoutUrl URL for timeout notifications.
 * @param {string} options.resultUrl URL for sending transaction results after processing.
 */
export interface businessPaybillOptions {
  initiator: string;
  amount: number;
  partyA: number;
  partyB: number;
  accountReference: number;
  requester?: number;
  QueueTimeOutURL: string;
  resultURL: string;
  remarks: string;
}

/**
 * @name taxRemittanceOptions
 * @param {Object} options Options for the tax remittance API.
 * @param {string} options.initiator M-Pesa API operator username with tax remittance API role.
 * @param {number} options.amount Transaction amount.
 * @param {number} options.partyA Shortcode from which money will be deducted.
 * @param {string} options.remarks Information to be associated with the transaction.
 * @param {number} options.partyB Account to which money will be credited.
 * @param {number} options.accountReference Payment registration number (PRN) from KRA.
 * @param {string} options.QueueTimeOutURL URL for timeout notifications before processing.
 * @param {string} options.resultUrl URL for sending transaction results after processing.
 */
export interface taxRemittanceOptions {
  initiator: string;
  amount: number;
  partyA: number;
  partyB: number;
  accountReference: number;
  QueueTimeOutURL: string;
  resultURL: string;
  remarks: string;
}

declare const mpesa: {
  /**
   * @name balanceQuery
   * @description The Account Balance API is used to request the account balance of a short code. This can be used for both B2C, buy goods and pay bill accounts.
   * @summary Retrieves the balance of a short code associated with the developer account, supporting B2C, buy goods, and pay bill accounts.
   * @see {@link https://developer.safaricom.co.ke/APIs/AccountBalance open external link}
   */
  balanceQuery(options: balanceQueryOptions): Promise<object>;
  /**
   * @name b2cRequest
   * @description B2C API can be used in several scenarios by businesses that require to either make Salary Payments, Cashback payments, Promotional Payments(e.g. betting winning payouts), winnings, financial institutions withdrawal of funds, loan disbursements, etc.
   * @summary B2C payments involve a business sending money to an individual. This is a direct transaction from a business shortcode to a consumer's mobile number (MSISDN).
   * @see {@link https://developer.safaricom.co.ke/APIs/BusinessToCustomer open external link}
   */
  b2cRequest(options: b2cRequestOptions): Promise<object>;
  /**
   * @name c2BRegister
   * @description Register URL API works hand in hand with Customer to Business (C2B) APIs and allows receiving payment notifications to your paybill. This API enables you to register the callback URLs via which you shall receive notifications for payments to your pay bill/till numbers
   * @summary Registers callback validation and confirmation URLs on M-Pesa to receive payment notifications for your paybill/till numbers.
   * @see {@link https://developer.safaricom.co.ke/APIs/CustomerToBusinessRegisterURL open external link}
   */
  c2BRegister(options: c2bRegisterOptions): Promise<object>;
  /**
   * @name c2bSimulate
   * @description This function simulates a C2B (Customer to Business) transaction by initiating a payment from a phone number to a business shortcode.
   * @summary This API initiates a payment from a phone number to a business shortcode
   * @see {@link https://developer.safaricom.co.ke/c2b/apis/post/simulate open external link}
   */
  c2bSimulate(options: c2bSimulateOptions): Promise<object>;
  /**
   * @name mpesaSimulate
   * @description Lipa na M-PESA online API also known as M-PESA express (STK Push/NI push) is a Merchant/Business initiated C2B (Customer to Business) Payment.
   * @summary Enable you to send a payment prompt on the customer's phone to your customer's M-PESA registered phone number
   * @see {@link https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate open external link}
   */
  mpesaSimulate(options: mpesaSimulateOptions): Promise<object>;
  /**
   * @name mpesaQuery
   * @description This API endpoint enables one to check the status of a Lipa Na M-Pesa Online Payment.
   * @summary Fetches the transaction status of a Lipa na M-Pesa payment
   * @see {@link https://developer.safaricom.co.ke/APIs/MpesaExpressQuery open external link}
   */
  mpesaQuery(options: mpesaQueryOptions): Promise<object>;
  /**
   * @name reversals
   * @description Enables one to reverse a previously successful Mpesa (simulate) transaction, using a unique identifier
   * @summary Reverse successful Mpesa transaction
   * @see {@link https://developer.safaricom.co.ke/APIs/Reversal open external link}
   */
  reversals(options: reversalsOptions): Promise<object>;
  /**
   * @name transactionStatus
   * @description Enables one to Check the status of an Mpesa transaction, using a unique identifier
   * @summary Fetches Mpesa transaction status
   * @see {@link https://developer.safaricom.co.ke/APIs/TransactionStatus open external link}
   */
  transactionStatus(options: transactionStatusOptions): Promise<object>;
  /**
   * @name generateQrCode
   * @description This generates a Dynamic QR which enables Safaricom M-PESA customers who have My Safaricom App or M-PESA app, to scan a QR (Quick Response) code, to capture till number and amount
   * @summary Generates QR codes for customers using My Safaricom app
   * @see {@link https://developer.safaricom.co.ke/APIs/DynamicQRCode open external link}
   */
  generateQrCode(options: generateQrCodeOptions): Promise<object>;
  /**
   *@name b2cTopUp
   *@description B2C Account Top-Up - Use this API to load funds to a B2C shortcode directly for disbursement.
   *@summary Moves money from your MMF/Working account to the recipient’s utility account.
   * @see {@link https://developer.safaricom.co.ke/APIs/B2CAccountTopUp open external link}
   */
  b2cTopUp(options: b2cTopUpOptions): Promise<object>;
  /**
   * @name businessPayBill
   * @description This API enables you to pay bills directly from your business account to a pay bill number, or a paybill store. You can use this API to pay on behalf of a consumer/requester. The transaction moves money from your MMF/Working account to the recipient’s utility account.
   * @summary  Facilitates bill payments from a business account to a paybill number, transferring funds to the recipient’s utility account.
   * @see {@link https://developer.safaricom.co.ke/APIs/BusinessPayBill open external link}
   */
  businessPayBill(options: businessPaybillOptions): Promise<object>;
  /**
   * @name taxRemittance
   * @description This API enables businesses to remit tax to Kenya Revenue Authority (KRA). To use this API, prior integration is required with KRA for tax declaration, payment registration number (PRN) generation, and exchange of other tax-related information.
   * @summary Enables one to remit tax to Kenya Revenue Authority (KRA)
   * @see {@link https://developer.safaricom.co.ke/APIs/TaxRemittance open external link}
   */
  taxRemittance(options: taxRemittanceOptions): Promise<object>;
};

interface AppWithUse {
  /**
   * Registers a middleware function.
   * @param middleware The middleware function to register.
   */
  use(middleware: (...args: any[]) => void): void;
}

declare const callbacks: {
  /**
   * @name handleBalanceQueryCallbacks
   * @description Default callback handler for the balanceQuery API
   **/
  handleBalanceQueryCallbacks: (app: AppWithUse) => void;
  /**
   * @name handleBusinessPaybillCallbacks
   * @description Default callback handler for the businessPaybill API
   **/
  handleBusinessPaybillCallbacks: (app: AppWithUse) => void;
  /**
   * @name handleTaxRemittanceCallbacks
   * @description Default callback handler for the taxRemittance API
   **/
  handleTaxRemittanceCallbacks: (app: AppWithUse) => void;
  /**
   * @name handleB2cTopUpCallbacks
   * @description Default callback handler for the b2cTopUp API
   **/
  handleB2cTopUpCallbacks: (app: AppWithUse) => void;
  /**
   * @name handleTransactStatusCallbacks
   * @description Default callback handler for the transaction status API
   **/
  handleTransactStatusCallbacks: (app: AppWithUse) => void;
  /**
   * @name handleB2cRequestCallbacks
   * @description Default callback handler for the b2cRequest API
   **/
  handleB2cRequestCallbacks: (app: AppWithUse) => void;
  /**
   * @name handleC2bRegisterCallbacks
   * @description Default callback handler for the c2bRegister API
   **/
  handleC2bRegisterCallbacks: (app: AppWithUse) => void;
  /**
   * @name handleReversalCallbacks
   * @description Default callback handler for the reversals API
   **/
  handleReversalCallbacks: (app: AppWithUse) => void;
  /**
   * @name handleMpesaSimulateCallbacks
   * @description Default callback handler for the mpesaSimulate API
   **/
  handleMpesaSimulateCallbacks: (app: AppWithUse) => void;
};

export { mpesa, callbacks };
