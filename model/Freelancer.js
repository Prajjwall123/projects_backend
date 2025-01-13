const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    skills: {
        type: [String],
        required: true
    },
    experienceYears: {
        type: Number,
        required: true
    },
    profileImage: {
        type: String
    },
    availability: {
        type: String,
        required: true
    },
    portfolio: {
        type: String,
        required: true
    },
    projectsCompleted: {
        type: Number,
        default: 0
    },
    profileImage: {
        type: String,
        default: null
    }
});

const Freelancer = mongoose.model("Freelancer", freelancerSchema);

module.exports = Freelancer;
