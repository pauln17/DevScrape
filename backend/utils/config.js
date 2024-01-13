require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SCHEDULED_TIME = process.env.SCHEDULED_TIME;

module.exports = {
  PORT,
  MONGODB_URI,
  SCHEDULED_TIME,
};
