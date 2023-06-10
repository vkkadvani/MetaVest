const Joi = require('joi');

const createVestingSchema = Joi.object({
    amount: Joi.required(),
    locked: Joi.boolean(),
    beneficiary: Joi.string().required().length(42),
    claimed: Joi.number().required(),
    networkId: Joi.string().required(),
    starttime: Joi.required(),
    endTime: Joi.required(),
    cliff: Joi.number().required(),
    slicePeriod: Joi.number().required().positive(),
    tokenId: Joi.required(),
    recieveOnInterval: Joi.required(),
    secretkey: Joi.string().required(),
    accsessToken: Joi.string().required()


}).unknown(true);

module.exports = { createVestingSchema };

