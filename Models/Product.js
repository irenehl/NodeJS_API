const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    SKU: String,
    name: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: String
}) 

module.exports = model('User', UserSchema)