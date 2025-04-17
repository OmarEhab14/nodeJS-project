const express = require('express')
const router = express.Router()
const products = require('../../products.js');
router.put('/:id', async (req, res) => {
    const productId = req.params.id
    const product = await products.updateOne({
        _id: productId,
    }, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            image: req.body.image,
            discount: req.body.discount,
        }
    });
    res.json(product);
})

module.exports = router