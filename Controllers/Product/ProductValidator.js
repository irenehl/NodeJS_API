const joi = require('joi')

const Validator = {
    registerValidator: data => {
        const validateSchema = joi.object({
            SKU: joi.string()
                .required(),
            name: joi.string()
                .required(),
            stock: joi.number()
                .required(),
            price: joi.number()
                .required(),
            img: joi.string(),
            description: joi.string()
        })

        return validateSchema.validateAsync(data)
    },

    updateValidator: data => {
        const validateSchema = joi.object({
            SKU: joi.string(),
            name: joi.string(),
            stock: joi.number(),
            price: joi.number(),
            img: joi.string(),
            description: joi.string()
        })

        return validateSchema.validateAsync(data)
    }
}

module.exports = Validator