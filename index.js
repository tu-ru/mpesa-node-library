import balanceQueryApi from "./lib/core/apis/balance-Query.js";
import b2cRequestApi from "./lib/core/apis/b2c-Request.js";
import c2bRegisterApi from "./lib/core/apis/c2b-Register.js";
import c2bSimulateApi from "./lib/core/apis/c2b-Simulate.js";
import mpesaSimulateApi from "./lib/core/apis/mpesa-Simulate.js";
import mpesaQueryApi from "./lib/core/apis/mpesa-Query.js";
import reversalsApi from "./lib/core/apis/reversals.js";
import generateQrCodeApi from "./lib/core/apis/qr-Generate.js";
import transactionStatusApi from "./lib/core/apis/transaction-Status.js";
import b2bTopUpApi from "./lib/core/apis/b2b-Topup.js";
import businessPaybillApi from "./lib/core/apis/business-Paybill.js";
import taxRemittanceApi from "./lib/core/apis/tax-Remittance.js";

const mpesa = {
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
export default mpesa;
