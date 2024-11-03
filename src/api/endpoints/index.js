import balanceQueryApi from "./balance-Query.js";
import b2cRequestApi from "./b2c-Request.js";
import c2bRegisterApi from "./c2b-Register.js";
import c2bSimulateApi from "./c2b-Simulate.js";
import mpesaSimulateApi from "./mpesa-Simulate.js";
import mpesaQueryApi from "./mpesa-Query.js";
import reversalsApi from "./reversals.js";
import generateQrCodeApi from "./qr-Generate.js";
import transactionStatusApi from "./transaction-Status.js";
import b2bTopUpApi from "./b2b-Topup.js";
import businessPaybillApi from "./business-Paybill.js";
import taxRemittanceApi from "./tax-Remittance.js";

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
