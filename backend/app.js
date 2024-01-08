const config = require('./utils/config')
const express = require('express')
const app = express()
const middleware = require('./utils/middleware')
const loggers = require('./utils/loggers')
const jobsRouter = require('./controllers/jobs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

loggers.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        loggers.info('Connected to MongoDB')
    })
    .catch(error => {
        loggers.error('Error connecting to MongoDB: ', error.message)
    })

// Misc
app.use(express.json())
app.use(middleware.requestLogger)

// Routes
app.use('/api/jobs', jobsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Middleware
app.use(middleware.unknownEndpoint)

module.exports = app