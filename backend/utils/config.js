require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SCHEDULED_TIME = process.env.SCHEDULED_TIME;
const PING_TIME = process.env.PING_TIME;

module.exports = {
    PORT,
    MONGODB_URI,
    SCHEDULED_TIME,
    PING_TIME,
};
