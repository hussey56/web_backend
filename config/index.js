const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const WhatsApp = process.env.WHATSAPP;
module.exports = {
  PORT,
  MONGO_DB_CONNECTION_STRING,
  ACCESS_TOKEN_SECRET,
  WhatsApp,
};
