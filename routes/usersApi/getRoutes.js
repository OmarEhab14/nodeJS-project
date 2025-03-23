const express = require('express')
const router = express.Router()
const users = require('../../users.js')

router.get('/', async (req, res) => {
    res.send(await users.find())
})

router.get('/:id', async (req, res) => {
    var id = req.params.id
    const user = await users.findById(id)
    res.json(user);
})

module.exports = router