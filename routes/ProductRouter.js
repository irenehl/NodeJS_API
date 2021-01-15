const express = require('express')
const router = express.Router()

const { uploadMulter } = require('../Controllers/Utilities/ImgUploader')
const { register, getProducts, updateProduct, deleteProduct, productSearcher } = require('../Controllers/Product/ProductController')

router.post('/register', uploadMulter.single('productImg'), register)

router.get('/search', productSearcher)
router.get('/', getProducts)

router.put('/update', updateProduct)

router.delete('/delete', deleteProduct)

module.exports = router