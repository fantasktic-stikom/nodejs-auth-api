const router = require('express').Router()
const AuthController = require('../controllers/auth.controller.js')
const middleware = require('../middleware/auth')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/profile',middleware.authorization, AuthController.profile)

module.exports = router 