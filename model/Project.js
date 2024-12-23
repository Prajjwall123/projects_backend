const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
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
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["posted", "awarded", "completed"],
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
