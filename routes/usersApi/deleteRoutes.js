const express = require('express')
const router = express.Router()
const users = require('../../users.js')


router.delete('/:id', async (req, res) => {
    const userId = req.params.id
    const user = await users.deleteOne({_id: userId})
    res.json(user);
})

module.exports = router