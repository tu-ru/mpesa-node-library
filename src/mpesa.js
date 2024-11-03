import mpesaAPIs from "./api/endpoints/index.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const {
  balanceQueryApi,
  b2cRequestApi,
  c2bRegisterApi,
  mpesaSimulateApi,
  c2bSimulateApi,
  mpesaQueryApi,
  b2bTopUpApi,
  reversalsApi,
  generateQrCodeApi,
  transactionStatusApi,
  businessPaybillApi,
  taxRemittanceApi,
} = mpesaAPIs;

/**
 * Class representing the M-Pesa instance.
 */
class Mpesa {
  /**
   * Create an instance of Mpesa.
   * @param {Object} [config={}] - The configuration object for M-Pesa.
   * @param {string} [config.consumerKey=process.env.CONSUMER_KEY] - The consumer key for authentication.
   * @param {string} [config.consumerSecret=process.env.CONSUMER_SECRET] - The consumer secret for authentication.
   * @param {string} [config.environment=process.env.ENVIRONMENT || 'sandbox'] - The environment, either 'production' or 'sandbox'.
   * @param {string} [config.certPath=process.env.CERT_PATH] - The path to the security certificate.
   * @throws {Error} Throws an error if consumer key or secret is missing.
   */
  constructor(config = {}) {
    const {
      consumerKey = process.env.CONSUMER_KEY,
      consumerSecret = process.env.CONSUMER_SECRET,
      environment = process.env.ENVIRONMENT || "sandbox",
      certPath = process.env.CERT_PATH,
      securityCredential = process.env.SECURITY_CREDENTIAL,
    } = config;

    if (!consumerKey) {
      throw new Error("Consumer Key is missing");
    }
    if (!consumerSecret) {
      throw new Error("Consumer Secret is missing");
    }

    // Set class properties
    this.configs = { consumerKey, consumerSecret, environment, certPath, securityCredential };
    this.baseURL = `https://${environment === "production" ? "api" : "sandbox"}.safaricom.co.ke`;
  }

  // All API methods remain the same
  balanceQueryApi() {
    return balanceQueryApi.bind(this)(...arguments);
  }

  b2cRequestApi() {
    return b2cRequestApi.bind(this)(...arguments);
  }

  c2bRegisterApi() {
    return c2bRegisterApi.bind(this)(...arguments);
  }

  c2bSimulateApi() {
    if (this.configs.environment === "production") {
      throw new Error("Cannot call C2B simulate in production.");
    }
    return c2bSimulateApi.bind(this)(...arguments);
  }


  mpesaSimulateApi() {
    return mpesaSimulateApi.bind(this)(...arguments);
  }

  mpesaQueryApi() {
    return mpesaQueryApi.bind(this)(...arguments);
  }

  reversalsApi() {
    return reversalsApi.bind(this)(...arguments);
  }

  generateQrCodeApi() {
    return generateQrCodeApi.bind(this)(...arguments);
  }

  transactionStatusApi() {
    return transactionStatusApi.bind(this)(...arguments);
  }

  b2bTopUpApi() {
    return b2bTopUpApi.bind(this)(...arguments);
  }

  businessPaybillApi() {
    return businessPaybillApi.bind(this)(...arguments);
  }

  taxRemittanceApi() {
    return taxRemittanceApi.bind(this)(...arguments);
  }
}

export default Mpesa;
