const { addLogindataSchema } = require('../schema/addLogindataSchema');

const addLogindataValidation = (req, res, next) => {
    const { error } = addLogindataSchema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log("inside joi error.............................................", error);
        return res.status(403).json({ message: 'Invalid API Call' });
    } else {
        next();
    }
};

module.exports = { addLogindataValidation };