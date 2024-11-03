import dotenv from "dotenv";
import path from "path";

// Load environment variables from the .env.local file
dotenv.config({ path: path.resolve("dist/.env.local") });

// Destructure the necessary environment variables
const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  INITIATOR_NAME,
  INITIATOR_PASS,
  SECURITY_CREDENTIAL,
  PASS_KEY,
  PARTY_A,
  PARTY_B,
  ENVIRONMENT,
  ENVIRONMENT_URL,
  REQUESTER,
  MSISDN,
  BUSINESS_SHORT_CODE,
  ACCOUNT_REFERENCE,
} = process.env;

// Create an object to hold the configuration
const configs = {
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  initiatorName: INITIATOR_NAME,
  initiatorPass: INITIATOR_PASS,
  securityCredential: SECURITY_CREDENTIAL,
  passKey: PASS_KEY,
  partyA: PARTY_A,
  partyB: PARTY_B,
  environment: ENVIRONMENT,
  environmentUrl: ENVIRONMENT_URL,
  requester: REQUESTER,
  msisdn: MSISDN,
  businessShortCode: BUSINESS_SHORT_CODE,
  accountRef: ACCOUNT_REFERENCE,
  certPath: "./dist/keys/SandboxCertificate.cer",
};

// Export the configuration object
export default configs;
