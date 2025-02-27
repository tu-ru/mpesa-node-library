import {
  balanceQuery,
  handleBalanceQueryCallbacks,
} from "./lib/core/apis/balance-Query.js";
import {
  b2cRequest,
  handleB2cRequestCallbacks,
} from "./lib/core/apis/b2c-Request.js";
import {
  c2bRegister,
  handleC2bRegisterCallbacks,
} from "./lib/core/apis/c2b-Register.js";
import {
  transactionStatus,
  handleTransactStatusCallbacks,
} from "./lib/core/apis/transaction-Status.js";
import {
  b2cTopUp,
  handleB2cTopUpCallbacks,
} from "./lib/core/apis/b2c-Topup.js";
import {
  businessPaybill,
  handleBusinessPaybillCallbacks,
} from "./lib/core/apis/business-Paybill.js";
import {
  taxRemittance,
  handleTaxRemittanceCallbacks,
} from "./lib/core/apis/tax-Remittance.js";
import {
  reversals,
  handleReversalCallbacks,
} from "./lib/core/apis/reversals.js";
import {
  mpesaSimulate,
  handleMpesaSimulateCallbacks,
} from "./lib/core/apis/mpesa-Simulate.js";
import { c2bSimulate } from "./lib/core/apis/c2b-Simulate.js";
import { mpesaQuery } from "./lib/core/apis/mpesa-Query.js";
import { generateQrCode } from "./lib/core/apis/qr-Generate.js";

const mpesa = {
  balanceQuery,
  b2cRequest,
  c2bRegister,
  c2bSimulate,
  mpesaSimulate,
  mpesaQuery,
  reversals,
  generateQrCode,
  transactionStatus,
  b2cTopUp,
  businessPaybill,
  taxRemittance,
};

const callbacks = {
  handleBalanceQueryCallbacks,
  handleBusinessPaybillCallbacks,
  handleTaxRemittanceCallbacks,
  handleB2cTopUpCallbacks,
  handleTransactStatusCallbacks,
  handleB2cRequestCallbacks,
  handleC2bRegisterCallbacks,
  handleReversalCallbacks,
  handleMpesaSimulateCallbacks,
};

export { mpesa, callbacks };
