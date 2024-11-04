import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Function to load environment variables from a specified path using dotenv
const loadEnv = (envPath) => dotenv.config({ path: envPath });

// Define the primary and fallback paths for environment files
const primaryEnvPath = path.resolve(process.cwd(), ".env"); // Path for main .env file in project root
const fallbackEnvPath = path.resolve(process.cwd(), "./lib/tests/.env.local"); // Path for fallback .env file, typically used during testing

// Function to check for the existence of .env files and load the appropriate one
const configSwapper = () => {
  if (fs.existsSync(primaryEnvPath)) {
    // If primary .env exists, load it and log confirmation
    console.log("Using primary .env file");
    loadEnv(primaryEnvPath);
  } else if (fs.existsSync(fallbackEnvPath)) {
    // If primary .env is not found, load fallback .env and log confirmation
    console.log("Primary .env file not found. Using fallback .env.local file");
    loadEnv(fallbackEnvPath);
  } else {
    // Log error if no .env files are found
    console.error("No .env file found. Please check your configuration.");
  }
};

// Execute the configSwapper function to load environment variables based on availability
configSwapper();

// Extract key environment variables after loading them into process.env
const {
  MPESA_CONSUMER_KEY, // Consumer key for M-Pesa API authentication
  MPESA_CONSUMER_SECRET, // Consumer secret for M-Pesa API authentication
  MPESA_SECURITY_CREDENTIAL, // Encrypted security credential required for API requests
  MPESA_PASS_KEY, // Pass key for specific M-Pesa transactions
  MPESA_CERT_PATH, // Path to the certificate file used for encryption
  ENVIRONMENT, // Environment variable indicating sandbox or production mode
} = process.env;

// Function to determine the base URL for API requests based on the environment (sandbox or production)
const baseURLSwapper = () =>
  ENVIRONMENT === "development" || ENVIRONMENT === "sandbox"
    ? "https://sandbox.safaricom.co.ke" // Sandbox URL for testing
    : "https://api.safaricom.co.ke"; // Production URL for live requests

const baseUrl = baseURLSwapper(); // Set baseUrl based on environment

// Define configuration object with all necessary variables for easy access throughout the application
const globalConfigs = {
  consumerKey: MPESA_CONSUMER_KEY,
  consumerSecret: MPESA_CONSUMER_SECRET,
  securityCredential: MPESA_SECURITY_CREDENTIAL,
  passKey: MPESA_PASS_KEY,
  certPath: MPESA_CERT_PATH,
  environment: ENVIRONMENT,
  baseUrl, // Base URL set dynamically based on environment
};

// Export the configuration object for use in other parts of the application
export default globalConfigs;
