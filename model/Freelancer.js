const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
        skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
        experienceYears: { type: Number },
        freelancerName: { type: String, maxlength: 255 },
        availability: { type: String },
        profession: { type: String },
        location: { type: String },
        aboutMe: { type: String },
        workAt: { type: String },
        languages: [{ type: String }],
        portfolio: { type: String },
        profileImage: { type: String },
        projectsCompleted: { type: Number, default: 0 },

        experience: [
            {
                title: { type: String },
                company: { type: String },
                from: { type: Number },
                to: { type: Number },
                description: { type: String },
            }
        ],

        certifications: [
            {
                name: { type: String },
                organization: { type: String },
            }
        ],
    },
    { timestamps: true }
);

const Freelancer = mongoose.model("Freelancer", freelancerSchema);

module.exports = Freelancer;
