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
            isTest: req.body.isTest,
        });
        await newProduct.save()
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Products.findByIdAndUpdate({ //replaced update one with findByIdAndUpdate to return the json object after finishing
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
        },
            { new: true }, // added this to return the new object after updating, not the old one.
        );
        // res.status(200).json(product);
        res.redirect('/discount')
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Products.deleteOne({ _id: productId })
        // res.status(200).json(product);
        res.redirect('/discount')
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