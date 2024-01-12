const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/loggers')
const cron = require('node-cron')
const Job = require('./models/job')
const { performance } = require('perf_hooks');
const { website, keywords, extract } = require('./puppeteer/scraper')
const loggers = require('./utils/loggers')

const task = async () => {
    const t0 = performance.now();
    try {
        await Job.deleteMany({})

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
    } catch (error) {
        loggers.info('Scraping Task Error: ', error)
    }

    const t1 = performance.now();
    loggers.info("Scraper completed in " + Math.floor(((t1 - t0) / 1000) * 1000) / 1000 + " seconds");
}

// Run daily at 10 AM
// cron.schedule('0 10 * * *', task)

// cron.schedule('37 12 * * *', task)

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
    task()
})