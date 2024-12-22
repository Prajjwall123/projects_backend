const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    companyBio: {
        type: String,
        required: true,
        maxlength: 255
    },
    employees: {
        type: Number,
        required: true
    },
    logo: {
        type: String,
        required: false,
        maxlength: 255
    },
    projectsAwarded: {
        type: Number,
        default: 0
    },
    projectsPosted: {
        type: Number,
        default: 0
    },
    projectsCompleted: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);