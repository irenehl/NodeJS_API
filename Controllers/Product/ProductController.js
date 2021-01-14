const Product = require('../../models/ProductModel')
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

            var actualProduct = await Product.findOne({_id: req.product._id})
            const matchProducts = await Product.find({SKU: req.body.SKU})

            var unique = true
            if(matchProducts.length != 0)
                matchProducts.forEach(u => {
                    if(req.product._id != p._id)
                        if(p.SKU == req.body.SKU)
                            unique = false
                })

            if(!unique)
                throw {error: true, message: "SKU already exits"}

            actualProduct = {
                SKU: req.body.SKU || actualProduct.SKU,
                name: req.body.name || actualProduct.name,
                stock: req.body.stock || actualProduct.stock,
                price: req.body.price || actualProduct.price,
                description: req.body.price || actualDescription
            }

            await Product.findOneAndUpdate({_id: req.product._id}, actualProduct)
            return res.status(200).json({error: false, message: "Product updated"})
        }
        catch(err) {
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },

    getProducts: async (req, res) =>  {
        try{
            console.log(req.query);
            const { page = 1, limit = 12 } = req.query

            const product = await Product.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await Product.countDocuments()

            return res.status(200).json({
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                product
            })
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({error: true, message: "Ups, something went wrong"})
        }
    },

    // getCurrentProduct: async (req, res) =>  {
    //     const Product = await Product.findOne({_id: req.product._id})

    //     return res.status(200).json(product)
    // }
}

module.exports = ProductController