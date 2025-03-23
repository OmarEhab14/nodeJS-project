const express = require('express')
const router = express.Router()
const users = require('../../users.js')

router.post('/', (req, res) => {
    const newUser = new users({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    newUser.save().then(res.json(newUser))
})

module.exports = router