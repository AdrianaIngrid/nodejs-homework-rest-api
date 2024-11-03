const signUpSchema = require("../services/schemas/signUpSchema");
const validateSignUp = async (req, res, next) => {
    const { error } = signUpSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: "Bad request", code: 400, message: 'Joi library error validation', details: error.details });
    }
    next();
};
module.exports = validateSignUp;
