import configs from "./configs.js";
import {
  CommandIDs,
  IdentifierTypes,
  responseTypes,
  trxCodeTypes
} from "../../../core/utils/constants.js";

export function createOptionsForQrCode() {
  return {
    merchantName: "TEST-Supermarket",
    refNo: "xewr34fer4t",
    amount: 2000,
    trxCode: trxCodeTypes.BUY_GOODS,
    cpi: "174379",
    size: "300"
  };
}

export function createOptionsForMpesaQuery(passRequestIdHere) {
  return {
    businessShortCode: parseInt(configs.businessShortCode),
    checkoutRequestId: `${passRequestIdHere}`
  };
}

export function createOptionsForB2c(NGROK_URL, msisdn) {
  return {
    partyA: parseInt(configs.partyA),
    partyB: msisdn,
    initiatorName: configs.initiatorName,
    amount: parseInt("1000"),
    commandId: CommandIDs.SALARY_PAYMENT,
    QueueTimeOutURL: `${NGROK_URL}/b2c/queue`,
    resultUrl: `${NGROK_URL}/b2c/result`,
    occasion: "TEST",
    remarks: "TEST"
  };
}

export function createOptionsForC2bSimulate() {
  return {
    shortCode: parseInt(configs.partyA),
    msisdn: configs.msisdn,
    amount: parseInt("100"),
    billRefNumber: "invoice008"
  };
}

export function createOptionsForBalance(NGROK_URL) {
  return {
    identifierType: IdentifierTypes.TILL_NUMBER,
    partyA: parseInt(configs.partyA),
    initiator: configs.initiatorName,
    QueueTimeOutURL: `${NGROK_URL}/accountbalance/queuetimeouturl`,
    resultUrl: `${NGROK_URL}/accountbalance/result`,
    remarks: "TEST"
  };
}

export function createOptionsForMpesaSimulate(NGROK_URL) {
  return {
    partyB: parseInt(configs.partyB),
    partyA: configs.msisdn,
    phoneNumber: configs.msisdn,
    transactionType: "CustomerPayBillOnline",
    transactionDesc:"TEST",
    amount: 1,
    callbackUrl: `${NGROK_URL}/path/result`,
    accountRef: configs.accountRef
  };
}

export function createOptionsForReversals(NGROK_URL, transId) {
  return {
    receiverParty: parseInt(configs.partyA),
    initiator: configs.initiatorName,
    transactionId: transId,
    amount: parseInt("100"),
    QueueTimeOutURL: `${NGROK_URL}/Reversal/queuetimeouturl`,
    resultUrl: `${NGROK_URL}/Reversal/result`,
    remarks: "TEST",
    occasion: "TEST"
  };
}

export function createOptionsForTransactionStatus(NGROK_URL) {
  return {
    identifierType: parseInt(IdentifierTypes.ORG_SHORTCODE),
    OriginatorConversationID: "AG_20190826_0000777ab7d848b9e721",
    transactionId: "OEI2AK4Q16",
    initiator: configs.initiatorName,
    partyA: parseInt(configs.partyA),
    resultUrl: `${NGROK_URL}/TransactionStatus/result/`,
    QueueTimeOutUrl: `${NGROK_URL}/TransactionStatus/queue/`,
    remarks: "TEST",
    occasion: "TEST"
  };
}

export function createOptionsForB2cAccTopUp(NGROK_URL) {
  return {
    accountReference: parseInt(configs.accountRef),
    partyA: parseInt(configs.partyA),
    partyB: parseInt(configs.partyB),
    requester: parseInt(configs.requester), //optional
    initiator: configs.initiatorName,
    amount: parseInt("100"),
    resultUrl: `${NGROK_URL}/path/result`,
    QueueTimeOutURL: `${NGROK_URL}/path/queue`,
    remarks: "TEST",
  };
}

export function createOptionsForC2bRegister(NGROK_URL) {
  return {
    confirmationUrl: `${NGROK_URL}/confirmation/result`,
    validationUrl: `${NGROK_URL}/validation/result`,
    shortCode: parseInt(configs.businessShortCode),
    responseType: responseTypes.CANCELLED
  };
}

export function createOptionsForB2bPaybill(NGROK_URL) {
  return {
    initiator: configs.initiatorName,
    partyA: parseInt(configs.partyA),
    partyB: parseInt(configs.partyB),
    amount: parseInt("100"),
    accountReference: parseInt(configs.accountRef),
    requester: parseInt(configs.requester), //optional
    resultUrl: `${NGROK_URL}/path/result`,
    QueueTimeOutURL: `${NGROK_URL}/path/queue`,
    remarks: "TEST"
  };
}

export function createOptionsForTaxRemittance(NGROK_URL) {
  return {
    accountReference: parseInt(configs.accountRef, 10),
    partyA: parseInt(configs.partyA, 10),
    partyB: parseInt(configs.partyB, 10),
    initiator: configs.initiatorName,
    amount: parseInt("100", 10),
    resultUrl: `${NGROK_URL}/remittax/result`,
    QueueTimeOutURL: `${NGROK_URL}/remittax/queue`,
    remarks: "TEST"
  };
}
