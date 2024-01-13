const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/loggers')
const cron = require('node-cron')
const Job = require('./models/job')
const { performance } = require('perf_hooks');
const { website, keywords, extract } = require('./puppeteer/scraper')
const loggers = require('./utils/loggers')
const mongoose = require('mongoose');

const task = async () => {
    const t0 = performance.now();
    let session;

    try {
        session = await mongoose.startSession();

        await session.withTransaction(async () => {
            await Job.deleteMany({}).session(session)
            loggers.info('Scraping...')

            const tempArray = []
            for (const word of keywords) {
                const jobs = await extract(website, word, 'Waterloo, ON', '24')
                tempArray.push(...jobs)
            }

            const jobsArray = []
            for (const job of tempArray) {
                const index = jobsArray.findIndex(i => i.title === job.title)
                if (index === -1) {
                    jobsArray.push(job)
                }
            }

            await Job.insertMany(jobsArray)
            await session.commitTransaction().session(session)
        })
    } catch (error) {
        loggers.info('Scraping Task Error: ', error)
    } finally {
        if (session) session.endSession()
    }

    const t1 = performance.now();
    loggers.info("Scraper completed in " + Math.floor(((t1 - t0) / 1000) * 1000) / 1000 + " seconds");
}

// Run daily at 10 AM
cron.schedule('0 10 * * *', task)

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})