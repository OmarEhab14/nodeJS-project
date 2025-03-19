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
    // if(!user) {
    //     res.status(404).json({
    //         status: "failure",
    //         "message": "Error 404 user not found"
    //     })
    // } else {
    //     user.name = req.body.name ? req.body.name : user.name
    //     user.age = req.body.age ? req.body.age : user.age
    //     user.department = req.body.department ? req.body.department : user.department

    //     fs.writeFile('./json/users.json', JSON.stringify(users), () => {
    //         res.status(201).json({
    //             status: "success",
    //             "data": {
    //                 updatedUser: user
    //             }
    //         })
    //     })
    // }
})

module.exports = router