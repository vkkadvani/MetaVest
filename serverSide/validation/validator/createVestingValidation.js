const { createVestingSchema } = require('../schema/createVestingSchema');

const vestingCreationValidation = (req, res, next) => {
    const { error } = createVestingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log("inside joi error.............................................", error);
        return res.status(403).json({ message: 'Invalid API Call' });
    } else {
        next();
    }
};

module.exports = { vestingCreationValidation };