import configs from "./configs.js";
import {
  CommandIDs,
  IdentifierTypes,
  responseTypes,
  trxCodeTypes,
} from "../../../core/utils/constants.js";

export function createOptionsForQrCode() {
  return {
    merchantName: "TEST-Supermarket",
    refNo: "xewr34fer4t",
    amount: 2000,
    trxCode: trxCodeTypes.BUY_GOODS,
    cpi: "174379",
    size: "300",
  };
}

export function createOptionsForMpesaQuery(passRequestIdHere) {
  return {
    shortCode: parseInt(configs.businessShortCode, 10),
    // passKey: "",
    checkoutRequestId: `${passRequestIdHere}`,
  };
}

export function createOptionsForB2c(NGROK_URL) {
  return {
    senderParty: parseInt(configs.partyA, 10),
    receiverParty: parseInt(configs.msisdn, 10),
    initiatorName: configs.initiatorName,
    amount: parseInt("1000"),
    commandId: CommandIDs.SALARY_PAYMENT,
    queueUrl: `${NGROK_URL}/b2c/queue`,
    resultUrl: `${NGROK_URL}/b2c/result`,
  };
}

export function createOptionsForC2bRegister(NGROK_URL) {
  return {
    shortCode: parseInt(configs.partyA, 10),
    responseType: responseTypes.COMPLETED,
    confirmationUrl: `${NGROK_URL}/confirmation/result`,
    validationUrl: `${NGROK_URL}/validation/result`,
  };
}

export function createOptionsForC2bSimulate() {
  return {
    shortCode: parseInt(configs.partyA, 10),
    msisdn: parseInt(configs.msisdn, 10),
    amount: parseInt("100", 10),
    billRefNumber: "invoice008",
  };
}

export function createOptionsForBalance(NGROK_URL) {
  return {
    idType: parseInt(IdentifierTypes.TILL_NUMBER, 10),
    shortCode: parseInt(configs.partyA, 10),
    initiator: configs.initiatorName,
    queueUrl: `${NGROK_URL}/accountbalance/queuetimeouturl`,
    resultUrl: `${NGROK_URL}/accountbalance/result`,
  };
}

export function createOptionsForMpesaSimulate(NGROK_URL) {
  return {
    passKey: configs.passKey,
    shortCode: parseInt(configs.businessShortCode, 10),
    msisdn1: parseInt(configs.msisdn, 10),
    msisdn2: parseInt(configs.msisdn, 10),
    amount: 1,
    callbackUrl: `${NGROK_URL}/path/result`,
    accountRef: "Test",
  };
}

export function createOptionsForReversals(NGROK_URL) {
  return {
    shortCode: parseInt(configs.partyA, 10),
    initiator: configs.initiatorName,
    transactionId: "OEI2AK4Q16",
    amount: parseInt("100", 10),
    queueUrl: `${NGROK_URL}/Reversal/queuetimeouturl`,
    resultUrl: `${NGROK_URL}/Reversal/result`,
    remarks: "Reversal Test",
    occasion: "Test Occasion",
  };
}

export function createOptionsForTransactionStatusApi(NGROK_URL) {
  return {
    idType: parseInt(IdentifierTypes.ORG_SHORTCODE, 10),
    receiverParty: parseInt(configs.partyA, 10),
    transactionId: "NEF61H8J60",
    initiator: configs.initiatorName,
    OriginatorConversationID: "AG_20241103_20106c21d3528ac5d558",
    queueUrl: `${NGROK_URL}/transactionStatusApi/queue`,
    resultUrl: `${NGROK_URL}/transactionStatusApi/result`,
  };
}

export function createOptionsForB2bAccTopUp(NGROK_URL) {
  return {
    accountReference: parseInt(configs.accountRef, 10),
    partyA: parseInt(configs.partyA, 10),
    partyB: parseInt(configs.partyB, 10),
    requester: parseInt(configs.requester, 10), //optional
    initiator: configs.initiatorName,
    amount: parseInt("100", 10),
    resultURL: `${NGROK_URL}/path/result`,
    queueTimeOutURL: `${NGROK_URL}/path/queue`,
  };
}

export function createOptionsForB2bPaybill(NGROK_URL) {
  return {
    accountReference: parseInt(configs.accountRef, 10),
    partyA: parseInt(configs.partyA, 10),
    partyB: parseInt(configs.partyB, 10),
    requester: parseInt(configs.requester, 10), //optional
    initiator: configs.initiatorName,
    amount: parseInt("100", 10),
    resultURL: `${NGROK_URL}/path/result`,
    queueTimeOutURL: `${NGROK_URL}/path/queue`,
  };
}

export function createOptionsForTaxRemittance(NGROK_URL) {
  return {
    accountReference: parseInt(configs.accountRef, 10),
    partyA: parseInt(configs.partyA, 10),
    partyB: parseInt(configs.partyB, 10),
    initiator: configs.initiatorName,
    amount: parseInt("100", 10),
    resultURL: `${NGROK_URL}/remittax/result`,
    queueTimeOutURL: `${NGROK_URL}/remittax/queue`,
  };
}
