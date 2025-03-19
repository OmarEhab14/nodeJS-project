const express = require('express')
const router = express.Router()
const users = require('../../users.js')

router.post('/', (req, res) => {
    // const user = req.body;
    // const currentId = usersJson[usersJson.length - 1].id
    // const newId = currentId + 1
    // const newUser = Object.assign({id: newId}, user)
    // usersJson.push(newUser)
    // fs.writeFile('./json/users.json', JSON.stringify(usersJson), () => {
    //     res.json(newUser)
    // })
    const newUser = new users({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    newUser.save().then(res.json(newUser))
})

module.exports = router