const Products = require('../models/product.model')

const getProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        res.status(200).json(product);
        return product;
    } catch (error) {
        res.status(500).json(error);
    }
}

const createProduct = async (req, res) => {
    try {
        const newProduct = new Products({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            image: req.body.image,
            discount: req.body.discount,
        });
        newProduct.save().then(res.status(200).json(newProduct))
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Products.updateOne({
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
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Products.deleteOne({ _id: productId })
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};