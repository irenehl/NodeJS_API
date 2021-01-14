const express = require('express')
const router = express.Router()

const { uploadMulter } = require('../controllers/Utilities/ImgUploader')
const { register, getProducts } = require('../Controllers/Product/ProductController')

router.post('/register', uploadMulter.single('productImg'), register)

router.get('/get-all', getProducts)

module.exports = router