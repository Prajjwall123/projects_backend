const joi = require("joi");

const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
    role: joi.string().required(),
})

function UserValidation(req, res, next) {
    const { name, email, phone, role } = req.body;
    const { error } = userSchema.validate({ name, email, phone, role })
    if (error) {
        return res.json(error)
    }
    next()
}

module.exports = UserValidation;