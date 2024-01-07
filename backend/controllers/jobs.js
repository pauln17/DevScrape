const jobsRouter = require('express').Router()
const jobs = require('../models/job')
const { website, extract } = require('../puppeteer/scraper')

jobsRouter.get('/', async (req, res) => {
    const { title, location, locationType, jobType, datePosted, limit } = request.body
})

module.exports = jobsRouter