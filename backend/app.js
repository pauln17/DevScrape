const config = require('./utils/config')
const express = require('express')
const app = express()
const middleware = require('./utils/middleware')
const loggers = require('./utils/loggers')

// TEMP
const { websites, scrape } = require('./puppeteer/scraper')
scrape(websites[0])

// Misc
app.use(express.json())
app.use(middleware.requestLogger)

// Routes

// Middleware
app.use(middleware.unknownEndpoint)

module.exports = app