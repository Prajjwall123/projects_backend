const mongoose = require("mongoose");

const biddingSchema = new mongoose.Schema(
    {
        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        message: {
            type: String,
            maxlength: 1000,
            required: true,
        },
        fileName: {
            type: String,
            maxlength: 1000,
            required: true,
        }
    },
    { timestamps: true }
);

const Bidding = mongoose.model("Bidding", biddingSchema);

module.exports = Bidding;