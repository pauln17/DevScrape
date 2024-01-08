const jobsRouter = require('express').Router()
const Job = require('../models/job')


jobsRouter.get('/', async (req, res) => {
    const jobs = Job.find({})
    res.json(jobs)
})

jobsRouter.get('/:id', async (req, res) => {
    const job = Job.findById(req.params.id)

    if (job) {
        res.status(200).json(job)
    } else {
        res.status(404).end()
    }
})

module.exports = jobsRouter