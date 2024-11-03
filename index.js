import balanceQueryApi from "./lib/apis/balance-Query.js";
import b2cRequestApi from "./lib/apis/b2c-Request.js";
import c2bRegisterApi from "./lib/apis/c2b-Register.js";
import c2bSimulateApi from "./lib/apis/c2b-Simulate.js";
import mpesaSimulateApi from "./lib/apis/mpesa-Simulate.js";
import mpesaQueryApi from "./lib/apis/mpesa-Query.js";
import reversalsApi from "./lib/apis/reversals.js";
import generateQrCodeApi from "./lib/apis/qr-Generate.js";
import transactionStatusApi from "./lib/apis/transaction-Status.js";
import b2bTopUpApi from "./lib/apis/b2b-Topup.js";
import businessPaybillApi from "./lib/apis/business-Paybill.js";
import taxRemittanceApi from "./lib/apis/tax-Remittance.js";

const mpesaAPIs = {
  balanceQueryApi,
  b2cRequestApi,
  c2bRegisterApi,
  c2bSimulateApi,
  mpesaSimulateApi,
  mpesaQueryApi,
  reversalsApi,
  generateQrCodeApi,
  transactionStatusApi,
  b2bTopUpApi,
  businessPaybillApi,
  taxRemittanceApi,
};
export default mpesaAPIs;
