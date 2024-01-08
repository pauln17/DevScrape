const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')
    res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).end()
    }
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    if (!password || password.length < 3) {
        return res.status(400).json({
            error: "User validation failed: password: Path `password` is required"
        })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter