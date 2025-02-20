import dotenv from "dotenv";
import path from "path";

// Load environment variables from the .env.local file
dotenv.config({ path: path.resolve("./lib/tests/.env.local") });

// Destructure the necessary environment variables
const {
  MPESA_INITIATOR_NAME,
  MPESA_INITIATOR_PASS,
  PARTY_A,
  PARTY_B,
  REQUESTER,
  MSISDN,
  BUSINESS_SHORT_CODE,
  ACCOUNT_REFERENCE,
} = process.env;

// Create an object to hold the configuration
const configs = {
  initiatorName: MPESA_INITIATOR_NAME,
  initiatorPass: MPESA_INITIATOR_PASS,
  partyA: PARTY_A,
  partyB: PARTY_B,
  requester: REQUESTER,
  msisdn: MSISDN,
  businessShortCode: BUSINESS_SHORT_CODE,
  accountRef: ACCOUNT_REFERENCE,
};

// Export the configuration object
export default configs;
