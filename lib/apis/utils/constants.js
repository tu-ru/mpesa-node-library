// Define constants for command IDs
const CommandIDs = {
  SALARY_PAYMENT: "SalaryPayment",
  BUSINESS_PAYMENT: "BusinessPayment",
  PROMOTION_PAYMENT: "PromotionPayment",
};
const IdentifierTypes = {
  MSISDN: 1,
  TILL_NUMBER: 2,
  ORG_SHORTCODE: 4,
};

const responseTypes = {
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const trxCodeTypes = {
  BUY_GOODS: "BG",
  WITHDRAW_AGENT_TILL: "WA",
  PAYBILL_BUSINESS_NUMBER: "PB",
  SEND_MONEY_MSISDN: "SM",
  SEND_TO_BUSINESS_MSISDN: "SB",
};

export { CommandIDs, IdentifierTypes, responseTypes, trxCodeTypes };
