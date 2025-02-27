import { callbacks } from "../../../../index.js";

// Destructure all available callbackHandlers

const {
  handleB2cRequestCallbacks,
  handleB2cTopUpCallbacks,
  handleBalanceQueryCallbacks,
  handleBusinessPaybillCallbacks,
  handleC2bRegisterCallbacks,
  handleTaxRemittanceCallbacks,
  handleTransactStatusCallbacks,
  handleReversalCallbacks,
  handleMpesaSimulateCallbacks,
} = callbacks;

// Nest all callbacks into one single exportable arrow function

const runSingleCallbacks = async (testName, app) => {
  switch (testName) {
    case "balanceQuery":
      await handleBalanceQueryCallbacks(app);
      break;
    case "transactionStatus":
      await handleTransactStatusCallbacks(app);
      break;
    case "c2bRegister":
      await handleC2bRegisterCallbacks(app);
      break;
    case "reversals":
      await handleReversalCallbacks(app);
      break;
    case "mpesaSimulate":
      await handleMpesaSimulateCallbacks(app);
      break;
    case "b2cTopUp":
      await handleB2cTopUpCallbacks(app);
      break;
    case "b2cRequest":
      await handleB2cRequestCallbacks(app);
      break;
    case "taxRemittance":
      await handleTaxRemittanceCallbacks(app);
      break;
    case "businessPaybill":
      await handleBusinessPaybillCallbacks(app);
      break;
    default:
    //null
  }
};

export { runSingleCallbacks };
