const Joi = require('joi');

module.exports  = Joi.object({

    userName: Joi.string().min(3).max(30).required(),

    password: Joi.string().required(),

    email: Joi.string().email().required(),
    
    vip: Joi.valid('on')
        
})









