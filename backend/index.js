const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/loggers');
const cron = require('node-cron');
const { task } = require('./puppeteer/scraper');
const https = require('https');

// Run daily at 10 AM
cron.schedule(config.SCHEDULED_TIME, task);

// Ping deployed frontend + backend sites to prevent sleeping
cron.schedule(config.PING_TIME, () => {
    https.get('https://job-webscraper-backend.onrender.com/api/jobs');
    https.get('https://job-webscraper.onrender.com');
    console.log('PINGED');
});

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
