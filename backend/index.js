const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/loggers')
// TEMP
const { website, scrape } = require('./puppeteer/scraper')

app.listen(config.PORT, () => {
    scrape(website)
    logger.info(`Server running on port ${config.PORT}`)
})