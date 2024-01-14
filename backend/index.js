const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/loggers');
const cron = require('node-cron');
const Job = require('./models/job');
const { performance } = require('perf_hooks');
const { extract } = require('./puppeteer/scraper');
const loggers = require('./utils/loggers');
const mongoose = require('mongoose');

const task = async () => {
    const t0 = performance.now();
    let session;

    try {
        session = await mongoose.startSession();

        await session.withTransaction(async () => {
            await Job.deleteMany({}).session(session);
            loggers.info('Scraping...');
            const jobs = await extract('Waterloo, ON', '24');
            await Job.insertMany(jobs, { session });
        });

        await session.commitTransaction();
    } catch (error) {
        loggers.info('Extract Task Error: ', error);
    } finally {
        session.endSession();
    }

    const t1 = performance.now();
    loggers.info(
        'Scraper completed in ' +
            Math.floor(((t1 - t0) / 1000) * 1000) / 1000 +
            ' seconds'
    );
};

// Run daily at 10 AM
cron.schedule(config.SCHEDULED_TIME, task);

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
