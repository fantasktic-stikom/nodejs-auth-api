const router = require('express').Router()
const AuthController = require('../controllers/auth.controller.js')

router.post('/register', AuthController.register)

module.exports = router 