import http from "http";
import ngrok from "ngrok";
import { app } from "./server.js";

export async function setupNgrokServer() {
  const SERVER = http.createServer(app);
  SERVER.listen(0);

  const port = SERVER.address().port;
  const NGROK_URL = await ngrok.connect(port);

  console.log(`ngrok tunnel created: ${NGROK_URL}`);

  // Teardown server and ngrok after tests
  async function teardown() {
    await ngrok.disconnect();
    SERVER.close();
    console.log("Server closed successfully");
  }

  return { NGROK_URL, teardown };
}

export function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}_${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      // Recursive call for nested objects
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
}
