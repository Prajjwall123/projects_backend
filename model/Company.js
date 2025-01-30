const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, maxlength: 255 },
    companyBio: { type: String, maxlength: 255 },
    employees: { type: Number },
    logo: { type: String, maxlength: 255 },
    projectsPosted: { type: Number, default: 0 },
    projectsAwarded: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

module.exports = Company;