const Products = require('../models/product.model')

const discount = async (req, res) => {
    var { id, discount } = req.body
    console.log(discount)
    if(!discount) {
        discount = 0
        console.log(discount)
    }
    try {
        const product = await Products.updateOne({
            _id: id,
        }, {
            $set: {
                discount: discount,
            }
        });
        // res.redirect('back')
        res.redirect(`/discount#product-${id}`);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = {
    discount,
};