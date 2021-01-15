const express = require('express')
const router = express.Router()

const Authenticator = require('./Authenticator')
const { register, loginUser, getCurrentUser, getAllUsers,
    updateUser, recoverPassword, requestPasswordHandler, deleteUser } = require('../Controllers/User/UserController')

router.get('/', getAllUsers)
router.get('/info', Authenticator, getCurrentUser)

router.post('/login', loginUser)
router.post('/register', register)
router.post('/recover-password', recoverPassword)
router.post('/recover-handler', requestPasswordHandler)

router.put('/update', Authenticator, updateUser)

router.delete('/delete', Authenticator, deleteUser)

module.exports = router