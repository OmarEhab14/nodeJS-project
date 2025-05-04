const Products = require('../models/product.model')

const discount = async (req, res) => {
    const { id, discount } = req.body
    if(!discount) {
        discount = 0
    }
    try {
        const product = await Products.updateOne({
            _id: id,
        }, {
            $set: {
                discount: discount,
            }
        });
        res.redirect('back')
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = {
    discount,
};