const Product = require('../../Models/ProductModel')
const { uploaderMethod } = require('../Utilities/ImgUploader')
const { registerValidator, updateValidator } = require('./ProductValidator')

const ProductController = {
    register: async (req, res) => {
        try {
            await registerValidator(req.body)
            var location = await uploaderMethod(req.file, 'product')
            console.log(location)

            const notUnique = await Product.find({SKU: req.body.SKU})

            if(notUnique.length != 0)
                throw "SKU alredy exits"

            let newProduct = new Product({
                SKU: req.body.SKU,
                name: req.body.name,
                stock: req.body.stock,
                price: req.body.price,
                description: req.body.price,
                img: location
            })

            await newProduct.save()
            return res.status(201).json({error: false, message: "Registered/Created"})
        }
        catch(err) {
            console.log(err);
            return res.status(400).json({error: true, message: err.details != null ? err.details[0].message : err})
        }
    },

    updateProduct: async (req, res) =>  {
        try {
            await updateValidator(req.body)

            var actualProduct = await Product.findOne({ SKU: req.body.SKU })
            const updateConflict = await Product.findOne({ SKU: req.body.newSKU })

            if(updateConflict)
                throw {error: true, message: "SKU already exits"}
            else if(!actualProduct)
                throw {error: true, message: "Product not found"}

            actualProduct = {
                SKU: req.body.newSKU || actualProduct.SKU,
                name: req.body.name || actualProduct.name,
                stock: req.body.stock || actualProduct.stock,
                price: req.body.price || actualProduct.price,
                description: req.body.price || actualProduct.description
            }

            await Product.findOneAndUpdate({SKU: req.body.SKU}, actualProduct)
            return res.status(200).json({error: false, message: "Product updated"})
        }
        catch(err) {
            console.log(err)
            return res.status(400).json({error: true, message: err.details != null ? err.details[0].message : JSON.stringify(err)})
        }
    },

    getProducts: async (req, res) =>  {
        try{
            console.log(req.query);
            const { page = 1, limit = 12 } = req.query

            const products = await Product.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await Product.countDocuments()

            return res.status(200).json({
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                products
            })
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({error: true, message: "Ups, something went wrong"})
        }
    },

    productSearcher: async (req, res) =>  {
        try{
            const { page = 1, limit = 12 } = req.query

            const products = await Product.find({ $or: [ {SKU: req.query.SKU}, {name: req.query.name} ] })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await Product.countDocuments()

            return res.status(200).json({
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                products
            })
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({error: true, message: "Ups, something went wrong"})
        }
    },

    deleteProduct: async (req, res) => {
        try {
            await Product.findOneAndDelete({ SKU: req.body.SKU})

            return res.status(200).json({error: false, message: "Deleted successfully"})
        }
        catch(err) {
            console.log(err);
            return res.status(400).json({error: true, message: "Ups! Something went wrong"})
        }
    }
}

module.exports = ProductController