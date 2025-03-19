const express = require('express')
const router = express.Router()
const users = require('../../users.js')

router.get('/', async (req, res) => {
    res.send(await users.find())
})

router.get('/:id', async (req, res) => {
    var id = req.params.id
    const user = await users.findById(id)
    // if(!user) {
    //     res.status(404).json({
    //         status: "failure",
    //         "message": "Error 404 user not found"
    //     })
    // } else {
    //     res.status(201).json({
    //         status: "success",
    //         "data": {
    //             user: user
    //         }
    //     });
    // }
    res.json(user);
})

module.exports = router