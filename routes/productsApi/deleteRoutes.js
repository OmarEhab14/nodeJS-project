const express = require('express')
const router = express.Router()
const products = require('../../products.js')


router.delete('/:id', async (req, res) => {
    const productId = req.params.id
    const product = await products.deleteOne({_id: productId})
    // if(!user) {
    //     res.status(404).json({
    //         status: "failure",
    //         "message": "Error 404 user not found"
    //     })
    // } else {
    //     const userIndex = users.findIndex((e) => e.id === parseInt(userId))
    //     const deletedUser = users.splice(userIndex, 1)[0]
        
    //     fs.writeFile('./json/users.json', JSON.stringify(users), () => {
    //         res.status(201).json({
    //             status: "success",
    //             "data": {
    //                 deletedUser: deletedUser
    //             }
    //         })
    //     })
    // }
    res.json(product);
})

module.exports = router