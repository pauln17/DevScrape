const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/loggers')
const { website, extract } = require('./puppeteer/scraper')

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})