const Joi = require('joi');

const addWhitelistSchema = Joi.object({
    decimals: Joi.number().required(),
    tokenAddress: Joi.string().required(),
    secretkey: Joi.string().required(),
    accsessToken: Joi.string().required(),
    tokenName: Joi.string().required(),
    tokenSymbol: Joi.string().required(),
    networkId: Joi.string().required()

}).unknown(true);

module.exports = { addWhitelistSchema };
