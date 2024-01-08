const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/loggers')
const cron = require('node-cron')
const Job = require('./models/job')
const { website, keywords, extract } = require('./puppeteer/scraper')


const task = async () => {
    console.log('Scraping...')
    try {
        await Job.deleteMany({})
        const jobsArray = []

        for (const word of keywords) {
            const jobs = await extract(website, word, 'Waterloo, ON', '1', 1)
            for (const job of jobs) {
                const index = jobsArray.findIndex(i => i.title === job.title)
                if (index === -1) {
                    jobsArray.push(job)
                }
            }
        }
        await Job.insertMany(jobsArray)
    } catch (error) {
        console.log('Scraping Task Error: ', error)
    }
    console.log('Scraping Complete')
}

// Run daily at 10 AM
// cron.schedule('0 10 * * *', task)

// Testing - (Run every 60s)
// cron.schedule('*/60 * * * * *', task)

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
    task()
})