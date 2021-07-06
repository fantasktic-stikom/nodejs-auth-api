const Joi = require('joi')
const registerSchema  = Joi.object().keys({
                            name: Joi.string().required(),
                            email: Joi.string().email().required(),
                            password: Joi.string().required()
                        })

module.exports = {
    registerSchema
}