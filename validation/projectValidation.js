const joi = require("joi");

const projectSchema = joi.object({
    company: joi.string().required(),
    title: joi.string().required(),
    category: joi.string().required(),
    requirements: joi.string().required(),
    description: joi.string().required(),
    postedDate: joi.date().required(),
    status: joi.string().valid("posted", "awarded", "completed").required(),
});

function ProjectValidation(req, res, next) {
    const { company, title, category, requirements, description, postedDate, status } = req.body;
    const { error } = projectSchema.validate({ company, title, category, requirements, description, postedDate, status });

    if (error) {
        return res.json(error);
    }

    next();
}

module.exports = ProjectValidation;
