const { addWhitelistSchema } = require('../schema/addWhitelistSchema');

const addWhitelistValidation = (req, res, next) => {
    const { error } = addWhitelistSchema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log("inside joi error.............................................", error);
        return res.status(403).json({ message: 'Invalid API Call' });
    } else {
        next();
    }
};

module.exports = { addWhitelistValidation };