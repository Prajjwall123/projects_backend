const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    postedDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    status: {
        type: String,
        required: true,
        enum: ["posted", "awarded", "completed"],
    },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);;

module.exports = Project;
