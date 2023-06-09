const Joi = require('joi');

const createVestingSchema = Joi.object({
    amount: Joi.number().required().precision(18),
    locked: Joi.boolean().invalid(true),
    beneficiary: Joi.string().required().length(42),
    claimed: Joi.number().required().precision(18),
    networkId: Joi.required(),
    starttime: Joi.required(),
    endTime: Joi.required(),
    cliff: Joi.number().integer().required().min(0),
    slicePeriod: Joi.number().integer().required().positive(),
}).unknown(true);

module.exports = { createVestingSchema };


// {
//  
//  tokenId: data.tokenId,
//  recieveOnInterval: ((slicePeriod * amount) / duration),
//  secretkey: "metavestbest",
//  accsessToken: localStorage.getItem('jwt')
// }