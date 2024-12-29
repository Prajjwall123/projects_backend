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
        maxlength: 255,
    },
    category: {
        type: String,
        required: true,
        maxlength: 255,
    },
    requirements: {
        type: String,
        required: true,
        maxlength: 255,
    },
    description: {
        type: String,
        required: true,
        maxlength: 255,
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

module.exports = mongoose.model("Project", projectSchema);
