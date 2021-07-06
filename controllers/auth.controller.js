const models = require('../models/index')
const validation = require('../utils/validation')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
require('dotenv').config()

class AuthController{
    constructor(){}

    // REGISTER
    async register(req, res) {
        try {
            const {
                name,
                email,
                password
            } = req.body
            const request = req.body
            
            const validate = validation.registerSchema.validate(request, {abortEarly: false})
            if (validate.error) {
                return res.status(422).json({
                    'success': false,
                    'messages': 'Validate error',
                    'error': validate.error.details
                })
            }    

            const validateEmail = await models.users.findOne({ where: { email: email } });
            if (validateEmail) {
                return res.status(422).json({
                    'success': false,
                    'message': 'Validate error',
                    'error': [{'message':'Email has already taken'}]
                })
            }
        
            const encryptedPassword = await bcrypt.hash(password, 10)
            const user = await models.users.create({
                name,
                email
            })
            user.password = encryptedPassword
            user.save()
        
            if(user) {
                return res.status(201).json({
                    'success': true,
                    'messages': 'User created successfully'
                });
            }

        } catch (error) {
            res.status(400).json({
                'success': false,
                'message': error.message
            });
        }
    }

    // LOGIN
    async login(req, res) {
        try {
            const {
                email,
                password
            } = req.body
            const request = req.body
            
            const validate = validation.loginSchema.validate(request, {abortEarly: false})
            if (validate.error) {
                return res.status(422).json({
                    'success': false,
                    'message': 'Validate error',
                    'error': validate.error.details
                })
            }   

            const user = await models.users.findOne({ where: { email: email } });

            if(!user) {
                return res.status(404).json({
                    'success': false,
                    'messages': 'User not found'
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                password,
                user.password
              );
        
            if (!passwordIsValid) {
                return res.status(401).send({
                    'success': false,
                    'accessToken': null,
                    'message': "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, process.env.SECRET_KEY_JWT, {
                expiresIn: 86400 // 24 hours
            });

            return res.send({
                id: user.id,
                name: user.name,
                email: user.email,
                accessToken: token
            });
        } catch (error) {
            return res.status(400).json({
                'success': false,
                'message': error.message
            });
        }
    }

    // PROFILE
    async profile(req, res, next) {
        try {
            const user = await models.users.findOne({ 
                where: { id: req.userId },
                attributes: {
                    exclude: ['password', 'updated_at']
                }
            });
            if(!user) {
                return res.status(404).json({
                    'success': false,
                    'messages': 'User not found'
                });
            }
            return res.send({
                'success': false,
                'data': user
            });
        } catch (error) {
            return res.status(400).json({
                'success': false,
                'message': error.message
            });
        }
    }

}

module.exports = new AuthController()