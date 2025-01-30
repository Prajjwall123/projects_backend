const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    experienceYears: { type: Number },
    freelancerName: { type: String, maxlength: 255 },
    availability: { type: String },
    portfolio: { type: String },
    profileImage: { type: String },
    projectsCompleted: { type: Number, default: 0 },
});

const Freelancer = mongoose.model("Freelancer", freelancerSchema);

module.exports = Freelancer;
