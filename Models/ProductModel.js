const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
    SKU: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    img: String
}) 

module.exports = model('Product', ProductSchema)