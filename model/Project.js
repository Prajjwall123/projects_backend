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
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
    }],
    requirements: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
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
        default: "posted",
    },
    awardedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Freelancer",
        default: null,
    },
    feedbackRequestedMessage: {
        type: String,
    },
    link: {
        type: String,
    },
    feedbackRespondMessage: {
        type: String,
    }

}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
