import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Function to load environment variables from a specified path using dotenv
const loadEnv = (envPath) => dotenv.config({ path: envPath });

const fallbackAlt = fs.existsSync("./lib/tests/.env.local")
  ? "./lib/tests/.env.local"
  : "./lib/tests/.env";
const primaryEnvPath = path.resolve(process.cwd(), ".env");
const fallbackEnvPath = path.resolve(process.cwd(), fallbackAlt);

// Function to check for the existence of .env files and load the appropriate one
const configSwapper = () => {
  if (fs.existsSync(primaryEnvPath)) {
    loadEnv(primaryEnvPath);
  } else if (fs.existsSync(fallbackEnvPath)) {
    loadEnv(fallbackEnvPath);
  } else {
    console.error("No .env file found. Please check your configuration.");
  }
};

configSwapper();
const {
  MPESA_CONSUMER_KEY, // Consumer key for M-Pesa API authentication
  MPESA_CONSUMER_SECRET, // Consumer secret for M-Pesa API authentication
  MPESA_SECURITY_CREDENTIAL, // Encrypted security credential required for API requests
  MPESA_PASS_KEY, // Pass key for specific M-Pesa transactions
  MPESA_CERT_PATH_DEV, // Path to the development/sandbox certificate file used for encryption
  MPESA_CERT_PATH_PROD, //Path to the production certificate file used for encryption
  ENVIRONMENT, // Environment variable indicating sandbox or production mode
} = process.env;

// Function to determine the base URL for API requests based on the environment (sandbox or production)
const baseURLSwapper = () =>
  ENVIRONMENT === "development" || ENVIRONMENT === "sandbox"
    ? "https://sandbox.safaricom.co.ke" // Sandbox URL for testing
    : "https://api.safaricom.co.ke"; // Production URL for live requests
const envCERTSwapper = () =>
  ENVIRONMENT === "development" || ENVIRONMENT === "sandbox"
    ? MPESA_CERT_PATH_DEV
    : MPESA_CERT_PATH_PROD;
const baseUrl = baseURLSwapper(); // Set baseUrl based on environment
const certificatePath = envCERTSwapper(); // Set encryption cert based on environment

// Define configuration object with all necessary variables for easy access throughout the application
const globalConfigs = {
  consumerKey: MPESA_CONSUMER_KEY,
  consumerSecret: MPESA_CONSUMER_SECRET,
  securityCredential: MPESA_SECURITY_CREDENTIAL,
  passKey: MPESA_PASS_KEY,
  certPath: certificatePath,
  environment: ENVIRONMENT,
  baseUrl, // Base URL set dynamically based on environment
};

// Validate required environment variables
const validateGlobalConfigs = () => {
  const requiredConfigs = [
    "consumerKey",
    "consumerSecret",
    "securityCredential",
    "passKey",
    "certPath",
    "environment",
    "baseUrl",
  ];

  const missingConfigs = requiredConfigs.filter(
    (config) => !globalConfigs[config],
  );

  if (missingConfigs.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingConfigs.join(", ")}`,
    );
  }
};

// Call validation function to ensure all necessary environment variables are defined
validateGlobalConfigs();

export default globalConfigs;
