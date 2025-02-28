const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["freelancer", "company"], required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    attempts: { type: Number, default: 0 },
    companyName: { type: String, maxlength: 255 },
    companyBio: { type: String },
    employees: { type: Number },
    logo: { type: String },
    projectsPosted: { type: Number, default: 0 },
    projectsAwarded: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    experienceYears: { type: Number },
    availability: { type: String },
    portfolio: { type: String },
    profileImage: { type: String },
    freelancerName: { type: String, maxlength: 255 },
});

module.exports = mongoose.model('OTP', otpSchema);
