export interface BalanceQueryOptions {
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

export interface b2cRequestApiOptions {
  OriginatorConversationID: string;
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

export interface C2BRegisterOptions {
  confirmationUrl: string;
  validationUrl: string;
  shortCode: number;
  responseType: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
}

export interface c2bSimulateApiOptions {
  msisdn: number;
  amount: number;
  billRefNumber: string;
  commandId: string;
  shortCode: number;
  consumerKey: string;
  consumerSecret: string;
}

export interface MpesaSimulateApiOptions {
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
  msisdn1: number;
  msisdn2: number;
  amount: number;
  callbackUrl: string;
  accountRef: string;
  transactionDesc: string;
  transactionType: string;
  shortCode: number;
  passKey: string;
}

export interface mpesaQueryApiOptions {
  checkoutRequestId: string;
  shortCode: number;
  passKey: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
}

export interface reversalsApiOptions {
  transactionId: string;
  amount: number;
  queueUrl: string;
  resultUrl: string;
  shortCode: string;
  remarks: string;
  occasion: string;
  initiator: string;
  receiverIdType: string;
  commandId: string;
  consumerKey: string;
  consumerSecret: string;
  baseURL: string;
  certPath: string;
  securityCredential: string;
}

export interface transactionStatusApiOptions {
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

export interface generateQrCodeApiOptions {
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

export interface b2bTopUpApiOptions {
  initiator: string;
  securityCredential: string;
  commandId: string;
  senderIdentifierType: number;
  receiverIdentifierType: number;
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

export interface businessPaybillApiOptions {
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

export interface TaxRemittanceOptions {
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

declare const mpesaAPIs: {
  balanceQueryApi(options: BalanceQueryOptions): Promise<never>;
  b2cRequestApi(options: b2cRequestApiOptions): Promise<never>;
  c2BRegister(options: C2BRegisterOptions): Promise<never>;
  c2bSimulateApi(options: c2bSimulateApiOptions): Promise<never>;
  mpesaSimulateApi(options: MpesaSimulateApiOptions): Promise<never>;
  mpesaQueryApi(options: mpesaQueryApiOptions): Promise<never>;
  reversalsApi(options: reversalsApiOptions): Promise<never>;
  transactionStatusApi(options: transactionStatusApiOptions): Promise<never>;
  generateQrCodeApi(options: generateQrCodeApiOptions): Promise<never>;
  b2bTopUpApi(options: b2bTopUpApiOptions): Promise<never>;
  businessPayBillApi(options: businessPaybillApiOptions): Promise<never>;
  taxRemittanceApi(options: TaxRemittanceOptions): Promise<never>;
};

export default mpesaAPIs;
