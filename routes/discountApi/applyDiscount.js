const express = require('express')
const router = express.Router()
const products = require('../../products.js')

router.post('/apply-discount', async (req, res) => {
    const {id, discount} = req.body
    try {
        const product = await products.updateOne({
            _id: id,
        }, {
            $set: {
                discount: discount,
            }
        });
        res.redirect('back')
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
    
})

module.exports = router