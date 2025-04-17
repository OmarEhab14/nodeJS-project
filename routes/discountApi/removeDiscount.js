const express = require('express')
const router = express.Router()
const products = require('../../products.js')

router.post('/remove-discount', async (req, res) => {
    const {id} = req.body
    try {
        const product = await products.updateOne({
            _id: id,
        }, {
            $set: {
                discount: 0,
            }
        });
        res.redirect('back')
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
    
})

module.exports = router