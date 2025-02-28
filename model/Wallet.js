const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    transactions: [
        {
            transactionId: String,
            amount: Number,
            type: String,
            date: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model("Wallet", walletSchema);
