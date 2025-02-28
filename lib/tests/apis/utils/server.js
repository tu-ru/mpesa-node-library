import http from "http";
import ngrok from "ngrok";
import express from "express";
import { runSingleCallbacks } from "./callbacks.js";

// Initialize Express app
const app = express();
app.use(express.json());

async function setupNgrokServer(name, disabled = true) {
  if (disabled) {
    console.info(
      "\x1b[43m\x1b[30m\x1b[1m%s\x1b[0m",
      " Ngrok server will not be initiated ",
    );
    return {
      NGROK_URL: "",
      teardown: async () => {},
    };
  }
  // Create and start the HTTP server on a random available port
  const SERVER = http.createServer(app);
  SERVER.listen(0);
  const port = SERVER.address().port;

  // Start ngrok tunnel
  const NGROK_URL = await ngrok.connect(port);

  // Initialize callback handlers
  await runSingleCallbacks(name, app);

  // Teardown function to clean up resources
  async function teardown() {
    console.info("\x1b[43m\x1b[30m\x1b[1m%s\x1b[0m", "Closing exposed port");
    try {
      await ngrok.disconnect();
      await new Promise((resolve, reject) => {
        SERVER.close((err) => (err ? reject(err) : resolve()));
      });
      console.log("\x1b[32m\x1b[1m%s\x1b[0m", "Server closed gracefully");
    } catch (err) {
      console.error(
        "\x1b[31m\x1b[1m%s\x1b[0m",
        "Error while closing server:",
        err,
      );
    } finally {
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    }
  }

  return { NGROK_URL, teardown };
}

export { setupNgrokServer };
