const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        companyName: { type: String, maxlength: 255 },
        companyBio: { type: String, maxlength: 255 },
        employees: { type: Number },
        logo: { type: String, maxlength: 255 },
        projectsPosted: { type: Number, default: 0 },
        projectsAwarded: { type: Number, default: 0 },
        projectsCompleted: { type: Number, default: 0 },
        founded: { type: Number, min: 1900, max: new Date().getFullYear() },
        ceo: { type: String, maxlength: 255 },
        headquarters: { type: String, maxlength: 255 },
        industry: { type: String, maxlength: 255 },
        website: { type: String, maxlength: 255 },
    },
    { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
