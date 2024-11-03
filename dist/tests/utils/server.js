import express from "express";
import EventEmitter from "events";
import { flattenObject } from "./helpers.js";

const app = express();
const emitter = new EventEmitter();
app.use(express.json());

/** ACCOUNT BALANCE QUERY **/
app.post("/accountbalance/result", (req, res) => {
  const resultData = req.body;
  const unpackedData = flattenObject(resultData);
  console.log("Success:", unpackedData);

  emitter.emit("balanceQueryCallback", unpackedData);

  res.status(200).send("Callback received");
});
app.post("/accountbalance/queuetimeouturl", (req, res) => {
  console.log("Timeout:", req.body);

  emitter.emit("queueTimeout", req.body);

  res.status(200).send("Queue timeout callback received");
});

/** B2C REQUEST CALLBACK **/
app.post("/b2c/result", (req, res) => {
  const resultData = req.body;
  console.log("Success:", resultData);

  emitter.emit("b2cRequestCallback", resultData);

  res.status(200).send("Callback received");
});
app.post("/b2c/queue", (req, res) => {
  console.log("Timeout:", req.body);

  emitter.emit("queueTimeout", req.body);

  res.status(200).send("Queue timeout callback received");
});

/** MPESA SIMULATE CALLBACK **/
app.post("/path/result", (req, res) => {
  const resultData = req.body;
  const unpackedData = flattenObject(resultData);
  console.log("Success:", unpackedData);

  emitter.emit("mpesaSimulateCallback", unpackedData);

  res.status(200).send("Callback received");
});

/** REVERSALS CALLBACK **/
app.post("/Reversal/result", (req, res) => {
  const resultData = req.body;
  const unpackedData = flattenObject(resultData);
  console.log("Success:", unpackedData);

  emitter.emit("reversalsCallback", unpackedData);

  res.status(200).send("Callback received");
});
app.post("/Reversal/queuetimeouturl", (req, res) => {
  console.log("Timeout:", req.body);

  emitter.emit("queueTimeout", req.body);

  res.status(200).send("Queue timeout callback received");
});

/** TRANSACTION STATUS CALLBACK **/
app.post("/transactionStatusApi/result", (req, res) => {
  const resultData = req.body;
  const unpackedData = flattenObject(resultData);
  console.log("Success:", unpackedData);
  emitter.emit("transactionStatusCallback", unpackedData);
  res.status(200).send("Callback received");
});
app.post("/transactionStatusApi/queue", (req, res) => {
  console.log("Timeout:", req.body);

  emitter.emit("queueTimeout", req.body);

  res.status(200).send("Queue timeout callback received");
});

/** B2B TOP UP CALLBACK **/
app.post("/result", (req, res) => {
  const resultData = req.body;
  const unpackedData = flattenObject(resultData);
  console.log("Success:", unpackedData);
  emitter.emit("b2bTopUpCallback", unpackedData);
  res.status(200).send("Callback received");
});
app.post("/queue", (req, res) => {
  console.log("Timeout:", req.body);
  emitter.emit("queueTimeout", req.body);
  res.status(200).send("Queue timeout callback received");
});

/** B2B PAYBILL CALLBACK **/
app.post("/result", (req, res) => {
  const resultData = req.body;
  const unpackedData = flattenObject(resultData);
  console.log("Success:", unpackedData);
  emitter.emit("b2bPaybillCallback", unpackedData);
  res.status(200).send("Callback received");
});
app.post("/queue", (req, res) => {
  console.log("Timeout:", req.body);
  emitter.emit("queueTimeout", req.body);
  res.status(200).send("Queue timeout callback received");
});

/** TAX REMITTANCE **/
app.post("/remittax/result", (req, res) => {
  const resultData = req.body;
  const unpackedData = flattenObject(resultData);
  console.log("Success:", unpackedData);
  emitter.emit("taxRemittanceCallback", unpackedData);
  res.status(200).send("Callback received");
});
app.post("/remittax/queue", (req, res) => {
  console.log("Timeout:", req.body);
  emitter.emit("queueTimeout", req.body);
  res.status(200).send("Queue timeout callback received");
});

// BY DEFAULT VALIDATION IS DISABLED - PERFORMING CALLBACK ON CONFIRMATION
/*app.post('/confirmation/result', (req, res) => {
  const resultData = req.body
  const unpackedData = flattenObject(resultData)

  console.log('Successfully simulated a customer to business confirmation:', unpackedData)

  // Emit the result data for the test to capture
  emitter.emit('c2bResult', unpackedData)

  // Send a response back to acknowledge
  res.status(200).send('Callback received')
})*/

export { app, emitter };
