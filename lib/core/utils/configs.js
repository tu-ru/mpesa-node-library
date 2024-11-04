import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const loadEnv = (envPath) => dotenv.config({ path: envPath });
// Define primary and fallback .env paths
const primaryEnvPath = path.resolve(process.cwd(), ".env");
// Fallback .env is the root .env for performing API endpoint tests
const fallbackEnvPath = path.resolve(process.cwd(), "./lib/tests/.env.local");

const configSwapper = () => {
    // Check if the primary .env file exists
    if (fs.existsSync(primaryEnvPath)) {
        console.log("Using primary .env file");
        loadEnv(primaryEnvPath);
    } else if (fs.existsSync(fallbackEnvPath)) {
        console.log("Primary .env file not found. Using fallback .env.local file");
        loadEnv(fallbackEnvPath);
    } else {
        console.error("No .env file found. Please check your configuration.");
    }
};
// Run the configSwapper function to load environment variables
configSwapper();

// Destructure high occurring environment variables
const {
    MPESA_CONSUMER_KEY,
    MPESA_CONSUMER_SECRET,
    MPESA_SECURITY_CREDENTIAL,
    MPESA_PASS_KEY,
    MPESA_CERT_PATH,
    ENVIRONMENT
} = process.env;

// Set the base URL based on the environment
const baseURLSwapper = () =>
    ENVIRONMENT === "development" || ENVIRONMENT === "sandbox"
        ? "https://sandbox.safaricom.co.ke"
        : "https://api.safaricom.co.ke";

const baseUrl = baseURLSwapper();

// Create the configuration object
const globalConfigs = {
    consumerKey: MPESA_CONSUMER_KEY,
    consumerSecret: MPESA_CONSUMER_SECRET,
    securityCredential: MPESA_SECURITY_CREDENTIAL,
    passKey: MPESA_PASS_KEY,
    certPath: MPESA_CERT_PATH,
    environment: ENVIRONMENT,
    baseUrl,
};

export default globalConfigs;
