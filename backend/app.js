const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const middleware = require('./utils/middleware')
const loggers = require('./utils/loggers')
const jobsRouter = require('./controllers/jobs')
const mongoose = require('mongoose')
const cors = require('cors')

loggers.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        loggers.info('Connected to MongoDB')
    })
    .catch(error => {
        loggers.error('Error connecting to MongoDB: ', error.message)
    })

// Misc
const allowedOrigins = ["http://localhost:3000", "https://job-webscraper.onrender.com"];
app.use(cors({
    origin: allowedOrigins,
}));
app.use(express.json())
app.use(middleware.requestLogger)

// Routes
app.use('/api/jobs', jobsRouter)

// Middleware
app.use(middleware.unknownEndpoint)

module.exports = app