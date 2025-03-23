const express = require('express')
const router = express.Router()
const users = require('../../users.js');
router.put('/:id', async (req, res) => {
    const userId = req.params.id
    const user = await users.updateOne({
        _id: userId,
    }, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }
    });
    res.json(user);
})

module.exports = router