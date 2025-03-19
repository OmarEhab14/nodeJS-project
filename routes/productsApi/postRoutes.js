const express = require('express')
const router = express.Router()
const products = require('../../products.js')

router.post('/', (req, res) => {
    const newProduct = new products({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        image: req.body.image,
    });
    newProduct.save().then(res.json(newProduct))
})

module.exports = router