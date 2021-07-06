const models = require('../models/index')
const validation = require('../utils/validation')
const bcrypt = require('bcrypt')
const Joi = require('joi')

class AuthController{
    constructor(){}
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
                    'messages': 'Validate error',
                    'error': validate.error.details
                })
            }    

            const validateEmail = await models.users.findOne({ where: { email: email } });
            if (validateEmail) {
                return res.status(422).json({
                    'messages': 'Validate error',
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
                    'status': 'OK',
                    'messages': 'User created successfully'
                });
            }

        } catch (error) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': error.message
            });
        }
    }

}

module.exports = new AuthController()