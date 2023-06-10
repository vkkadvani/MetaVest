const Joi = require('joi');

const addLogindataSchema = Joi.object({

    address: Joi.string().required(),
    nounce: Joi.number().required()

}).unknown(true);

module.exports = { addLogindataSchema };
